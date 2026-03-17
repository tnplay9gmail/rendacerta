import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppIcon } from '@/components/ui/AppIcon';
import { Colors, shadows } from '@/constants/colors';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';
import { WebContainer } from '@/components/web/WebContainer';

export default function SobreRendeMais() {
  const insets = useSafeAreaInsets();
  const { isDesktop } = useResponsiveLayout();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { paddingTop: isDesktop ? 32 : insets.top + 16, paddingBottom: insets.bottom + 24 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <WebContainer>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton} activeOpacity={0.7}>
        <AppIcon name="arrow-left" size={22} color={Colors.neutral[700]} />
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.title}>Sobre o Rende Mais</Text>
        <Text style={styles.subtitle}>Política de Privacidade e Termos de Uso</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Dados e informações</Text>
        <Text style={styles.body}>
          Taxas e simulações são aproximadas e podem variar. As informações exibidas no aplicativo
          não constituem recomendação de investimento e não substituem orientação profissional. Para
          melhorar a experiência, medir desempenho e entender quais ofertas despertam mais
          interesse, o Rende Mais pode registrar eventos de uso, incluindo cliques em ofertas,
          botões, links e outras interações relevantes dentro do aplicativo. Esses dados podem ser
          utilizados para analytics, relatórios de desempenho, melhoria do serviço e também podem
          ser compartilhados ou comercializados de forma agregada e anonimizada.
        </Text>

        <Text style={styles.sectionTitle}>Marcas e créditos</Text>
        <Text style={styles.body}>
          As marcas, nomes, logotipos e demais sinais citados pertencem aos seus respectivos
          proprietários. Algumas ofertas, links e menções podem aparecer em contexto de afiliação,
          parceria comercial, patrocínio ou outros acordos legítimos com bancos, instituições
          financeiras e outras empresas. Caso haja alguma solicitação relacionada ao uso de marca ou
          crédito, entre em contato com a equipe do Rende Mais.
        </Text>

        <Text style={styles.sectionTitle}>Uso e licença</Text>
        <Text style={styles.body}>
          Este é um aplicativo gratuito de utilidade pública. Seu conteúdo é protegido e as taxas
          são atualizadas periodicamente via nuvem. O funcionamento e a manutenção do aplicativo
          podem envolver monetização por meio de links legítimos de afiliados, campanhas
          patrocinadas, parcerias comerciais e outros relacionamentos com bancos e outras empresas.
          O Rende Mais também pode utilizar relatórios de desempenho e dados agregados e
          anonimizados de cliques e interações para apoiar decisões de produto, operação,
          monetização e desenvolvimento de novas parcerias.
        </Text>

        <Text style={styles.sectionTitle}>Suporte e Contato</Text>
        <Text style={styles.body}>
          Dúvidas, sugestões ou solicitações de remoção de dados podem ser enviadas para:{"\n"}
          <Text style={{ color: Colors.brand[600], fontWeight: '600' }}>
            rendemaisaplicativo@gmail.com
          </Text>
        </Text>

        <View style={styles.separator} />

        <Text style={[styles.body, { fontSize: 12, textAlign: 'center', opacity: 0.7 }]}>
          Versão 1.0.0 (Build 2026.03) {"\n"}
          Política de Privacidade atualizada em Março/2026
        </Text>
      </View>
      </WebContainer>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  header: {
    marginBottom: 18,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    color: Colors.neutral[950],
  },
  subtitle: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: Colors.neutral[400],
    marginTop: 6,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.neutral[100],
    gap: 12,
    ...shadows.card,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.neutral[700],
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  body: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: Colors.neutral[500],
    lineHeight: 22,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.neutral[100],
    marginVertical: 4,
  },
});
