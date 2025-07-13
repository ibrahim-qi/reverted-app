import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, RouteProp } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';

import { Colors } from '../constants/colors';
import { GradientCard } from '../components/GradientCard';
import { ESSENTIAL_DUAS } from '../constants/learningContent';
import { RootStackParamList } from '../navigation/AppNavigator';

type RouteParams = RouteProp<RootStackParamList, 'DuaDetail'>;

const DuaDetailScreen: React.FC = () => {
  const route = useRoute<RouteParams>();
  const { duaId } = route.params;
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  
  const dua = ESSENTIAL_DUAS.find(d => d.id === duaId);

  const playAudio = async () => {
    try {
      if (sound && isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
        return;
      }

      // Note: In a real app, you would have audio files for each dua
      // For now, we'll just simulate playing
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setIsPlaying(true);
      
      // Simulate audio playing for 3 seconds
      setTimeout(() => {
        setIsPlaying(false);
      }, 3000);
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const shareDua = async () => {
    if (!dua) return;
    
    try {
      await Share.share({
        message: `${dua.title}\n\nArabic: ${dua.arabic}\n\nTransliteration: ${dua.transliteration}\n\nTranslation: ${dua.translation}\n\nOccasion: ${dua.occasion}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (!dua) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loading}>
          <Text>Dua not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Card */}
        <GradientCard
          colors={[Colors.primary, Colors.primaryDark]}
          style={styles.headerCard}
        >
          <Text style={styles.title}>{dua.title}</Text>
          <Text style={styles.occasion}>{dua.occasion}</Text>
        </GradientCard>

        {/* Arabic Text */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Arabic</Text>
            <TouchableOpacity
              style={styles.playButton}
              onPress={playAudio}
            >
              <Ionicons 
                name={isPlaying ? "pause-circle" : "play-circle"} 
                size={32} 
                color={Colors.primary} 
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.arabicText}>{dua.arabic}</Text>
        </View>

        {/* Transliteration */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Transliteration</Text>
          <Text style={styles.transliterationText}>{dua.transliteration}</Text>
        </View>

        {/* Translation */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Translation</Text>
          <Text style={styles.translationText}>{dua.translation}</Text>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={shareDua}
          >
            <Ionicons name="share-outline" size={24} color={Colors.primary} />
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
          >
            <Ionicons name="bookmark-outline" size={24} color={Colors.primary} />
            <Text style={styles.actionText}>Save</Text>
          </TouchableOpacity>
        </View>

        {/* Tips */}
        <View style={styles.tipsCard}>
          <Ionicons name="information-circle" size={24} color={Colors.secondary} />
          <View style={styles.tipsContent}>
            <Text style={styles.tipsTitle}>Tips for Memorization</Text>
            <Text style={styles.tipsText}>
              • Read the transliteration slowly{'\n'}
              • Listen to the audio repeatedly{'\n'}
              • Practice during the appropriate occasions{'\n'}
              • Understand the meaning to help retention
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCard: {
    margin: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.light,
    textAlign: 'center',
  },
  occasion: {
    fontSize: 16,
    color: Colors.text.light,
    opacity: 0.9,
    marginTop: 8,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  playButton: {
    padding: 4,
  },
  arabicText: {
    fontSize: 28,
    color: Colors.text.primary,
    textAlign: 'right',
    lineHeight: 44,
    fontWeight: '600',
    backgroundColor: Colors.surface,
    padding: 20,
    borderRadius: 12,
  },
  transliterationText: {
    fontSize: 18,
    color: Colors.text.primary,
    lineHeight: 28,
    fontStyle: 'italic',
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
  },
  translationText: {
    fontSize: 16,
    color: Colors.text.primary,
    lineHeight: 24,
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 40,
    marginVertical: 24,
  },
  actionButton: {
    alignItems: 'center',
    padding: 12,
  },
  actionText: {
    fontSize: 14,
    color: Colors.primary,
    marginTop: 4,
  },
  tipsCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    padding: 16,
    marginHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipsContent: {
    flex: 1,
    marginLeft: 12,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
});

export default DuaDetailScreen;