import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  Linking,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const horarios = [
  '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00',
  '16:00', '17:00', '18:00'
];

const servicos = [
  { nome: 'Lavagem Simples', valor: 5000 },
  { nome: 'Lavagem Completa', valor: 8000 },
  { nome: 'Higienização Interna', valor: 10000 },
];

export default function TelaAgendamento() {
  const [nomeCliente, setNomeCliente] = useState('');
  // NOVO ESTADO PARA O TELEFONE
  const [telefoneCliente, setTelefoneCliente] = useState(''); 
  const [dataSelecionada, setDataSelecionada] = useState<Date | null>(null);
  const [dataTexto, setDataTexto] = useState('');
  const [mostrarDatePicker, setMostrarDatePicker] = useState(false);
  const [servicoSelecionado, setServicoSelecionado] = useState<typeof servicos[0] | null>(null);
  const [horarioSelecionado, setHorarioSelecionado] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  const formatarData = (data: Date) => data.toLocaleDateString('pt-BR');

  const abrirDatePicker = () => {
    setMostrarDatePicker(true);
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || dataSelecionada || new Date();

    if (Platform.OS === 'android') {
      setMostrarDatePicker(false);
    }
    
    if (event.type === 'set' || event.type === undefined) {
      setDataSelecionada(currentDate);
      setDataTexto(formatarData(currentDate));
    } else {
        setMostrarDatePicker(false);
    }
  };

  const validarDataTexto = (texto: string) => {
    const partes = texto.split('/');
    if (partes.length === 3) {
      const [dia, mes, ano] = partes.map(Number);
      const fullAno = ano < 100 ? (ano < new Date().getFullYear() % 100 + 10 ? 2000 + ano : 1900 + ano) : ano;
      const data = new Date(fullAno, mes - 1, dia);
      
      if (
        data instanceof Date && !isNaN(data.getTime()) &&
        data.getDate() === dia &&
        data.getMonth() === mes - 1 &&
        data.getFullYear() === fullAno
      ) {
        setDataSelecionada(data);
        setDataTexto(texto);
      } else {
        Alert.alert('Data inválida', 'Digite uma data válida no formato dd/mm/aaaa');
        setDataSelecionada(null);
        setDataTexto('');
      }
    } else if (texto === '') {
        setDataSelecionada(null);
    } else {
      Alert.alert('Formato inválido', 'Use o formato dd/mm/aaaa');
      setDataSelecionada(null);
    }
  };

  const handlePagamento = async () => {
    console.log('handlePagamento foi chamado');
  
    // Validar se o telefone também foi preenchido
    if (!nomeCliente || !telefoneCliente || !dataSelecionada || !servicoSelecionado || !horarioSelecionado) {
      Alert.alert('Erro', 'Preencha todos os campos antes de prosseguir, incluindo o telefone.');
      return;
    }
  
    try {
      setCarregando(true);
  
      const bodyEnvio = {
        cliente: nomeCliente,
        telefone: telefoneCliente, // Adicionando o telefone ao payload
        data: dataSelecionada.toISOString().split('T')[0],
        servico: servicoSelecionado.nome,
        valor: servicoSelecionado.valor,
        horario: horarioSelecionado,
      };
  
      console.log('Enviando requisição com:', bodyEnvio);
  
      const response = await fetch('http://192.168.101.12:5678/webhook-test/criar-sessao-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyEnvio),
      });
  
      const data = await response.json();
  
      console.log('Resposta do servidor:', data);
  
      if (data?.checkout_url) {
        Linking.openURL(data.checkout_url);
      } else {
        Alert.alert('Erro', 'Não foi possível iniciar o pagamento. Tente novamente mais tarde.');
      }
    } catch (error) {
      console.error('Erro na requisição de pagamento:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao iniciar o pagamento.');
    } finally {
      setCarregando(false);
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Agendamento</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome do cliente"
        value={nomeCliente}
        onChangeText={setNomeCliente}
      />

      {/* NOVO CAMPO PARA O TELEFONE */}
      <TextInput
        style={styles.input}
        placeholder="Telefone (com DDD)"
        value={telefoneCliente}
        onChangeText={setTelefoneCliente}
        keyboardType="phone-pad" // Teclado otimizado para telefone
      />

      <View style={styles.inputDataContainer}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Data (dd/mm/aaaa)"
          value={dataTexto}
          onChangeText={(text) => setDataTexto(text)}
          onEndEditing={() => validarDataTexto(dataTexto)}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.botaoCalendario} onPress={abrirDatePicker}>
          <Text style={{ fontSize: 24 }}>📅</Text>
        </TouchableOpacity>
      </View>

      <Modal
        transparent={true}
        animationType="fade"
        visible={mostrarDatePicker}
        onRequestClose={() => setMostrarDatePicker(false)}
      >
        <Pressable
          style={styles.centeredView}
          onPress={() => Platform.OS === 'ios' && setMostrarDatePicker(false)}
        >
          <Pressable style={styles.datePickerModal}>
            <DateTimePicker
              value={dataSelecionada || new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onDateChange}
              minimumDate={new Date()}
            />
            {Platform.OS === 'ios' && (
              <TouchableOpacity
                style={styles.doneButton}
                onPress={() => setMostrarDatePicker(false)}
              >
                <Text style={styles.doneButtonText}>Confirmar</Text>
              </TouchableOpacity>
            )}
          </Pressable>
        </Pressable>
      </Modal>

      <Text style={styles.subtitulo}>Selecione o serviço</Text>
      {servicos.map((servico) => (
        <TouchableOpacity
          key={servico.nome}
          style={[
            styles.opcao,
            servicoSelecionado?.nome === servico.nome && styles.opcaoSelecionada,
          ]}
          onPress={() => setServicoSelecionado(servico)}
        >
          <Text style={styles.textoOpcao}>
            {servico.nome} - R$ {(servico.valor / 100).toFixed(2)}
          </Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.subtitulo}>Escolha um horário</Text>
      <FlatList
        data={horarios}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.horario,
              horarioSelecionado === item && styles.horarioSelecionado,
            ]}
            onPress={() => setHorarioSelecionado(item)}
          >
            <Text style={styles.textoHorario}>{item}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
        numColumns={3}
        columnWrapperStyle={styles.horarioRow}
      />

    <TouchableOpacity
      style={[
        styles.botao,
        (!nomeCliente || !telefoneCliente || !dataSelecionada || !servicoSelecionado || !horarioSelecionado || carregando) && styles.botaoDesativado
      ]}
      onPress={handlePagamento}
      disabled={!nomeCliente || !telefoneCliente || !dataSelecionada || !servicoSelecionado || !horarioSelecionado || carregando}
    >
      <Text style={styles.textoBotao}>
        {carregando ? 'Processando...' : 'PAGAR AGORA'}
      </Text>
    </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60, backgroundColor: '#fff' },
  titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  subtitulo: { fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
  },
  inputDataContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  botaoCalendario: {
    marginLeft: 10,
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 8,
  },
  opcao: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  opcaoSelecionada: {
    backgroundColor: '#9b59b6',
  },
  textoOpcao: {
    fontSize: 16,
    color: '#000',
  },
  horario: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  horarioSelecionado: {
    backgroundColor: '#2D9CDB',
  },
  textoHorario: {
    fontSize: 18,
    color: '#000',
  },
  horarioRow: {
    justifyContent: 'space-around',
    marginBottom: 5,
  },
  botao: {
    backgroundColor: '#27AE60',
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 10,
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
  },
  botaoDesativado: {
    backgroundColor: '#a5a5a5',
  },
  textoBotao: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  datePickerModal: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    width: '80%',
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  doneButton: {
    marginTop: 10,
    backgroundColor: '#27AE60',
    padding: 10,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  doneButtonText: {
    color: 'white',
    fontWeight: 'bold',
  }
});