// app/(tabs)/index.tsx

import { Image } from 'expo-image';
import { Link } from 'expo-router'; // Importe Link
import { Platform, Pressable, StyleSheet } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText'; // Certifique-se de que ThemedText vem daqui
import { ThemedView } from '@/components/ThemedView'; // Certifique-se de que ThemedView vem daqui

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>

      {/* NOVO BLOCO COM O BOTÃO DE AGENDAMENTO */}
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Agende sua lavagem</ThemedText>
        <ThemedText>
          {`Pressione o botão abaixo para agendar seu serviço de lavajato.`}
        </ThemedText>
        {/*
          CORREÇÃO AQUI: Mudei o href de "/screens/TelaAgendamento" para "/TelaAgendamento"
          Isso resolve o erro de tipagem no TypeScript do Expo Router.
        */}
        <Link href="/TelaAgendamento" asChild>
          <Pressable style={styles.button}>
            <ThemedText type="defaultSemiBold" style={styles.buttonText}>
              Ir para Agendamento
            </ThemedText>
          </Pressable>
        </Link>
      </ThemedView>
      {/* FIM DO NOVO BLOCO */}

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">profissionais qualificados</ThemedText>
        <ThemedText>
          Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
          Press{' '}
          <ThemedText type="defaultSemiBold">
            {Platform.select({
              ios: 'cmd + d',
              android: 'cmd + m',
              web: 'F12',
            })}
          </ThemedText>{' '}
          to open developer tools.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">atendimento personalizado</ThemedText>
        <ThemedText>
          {`Tap the Explore tab to learn more about what's included in this starter app.`}
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">preço competitivo</ThemedText>
        <ThemedText>
          {`When you're ready, run `}
          <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  // Estilos para o novo botão
  button: {
    backgroundColor: '#007AFF', // Cor de exemplo (azul)
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF', // Cor do texto (branco)
    fontSize: 16,
  },
});