import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { Colors } from '../constants/colors';
import { GradientCard } from '../components/GradientCard';
import { LEARNING_MODULES, ESSENTIAL_DUAS } from '../constants/learningContent';
import { LearningModule, Dua } from '../types';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = StackNavigationProp<RootStackParamList>;

const LearnScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [activeTab, setActiveTab] = useState<'modules' | 'duas'>('modules');

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'basics': return Colors.primary;
      case 'prayer': return Colors.accent;
      case 'quran': return Colors.secondary;
      case 'daily-life': return Colors.primaryDark;
      default: return Colors.primary;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'basics': return 'school';
      case 'prayer': return 'hand-right';
      case 'quran': return 'book';
      case 'daily-life': return 'sunny';
      default: return 'school';
    }
  };

  const renderModule = ({ item }: { item: LearningModule }) => {
    const completedLessons = item.lessons.filter(l => l.completed).length;
    const progress = (completedLessons / item.lessons.length) * 100;

    return (
      <TouchableOpacity
        style={styles.moduleCard}
        onPress={() => navigation.navigate('LessonDetail', { moduleId: item.id, lessonId: item.lessons[0].id })}
      >
        <View style={[styles.moduleIcon, { backgroundColor: getCategoryColor(item.category) }]}>
          <Ionicons 
            name={getCategoryIcon(item.category) as any} 
            size={24} 
            color={Colors.text.light} 
          />
        </View>
        <View style={styles.moduleContent}>
          <Text style={styles.moduleTitle}>{item.title}</Text>
          <Text style={styles.moduleDescription}>{item.description}</Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.progressText}>
              {completedLessons}/{item.lessons.length} lessons
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderDua = ({ item }: { item: Dua }) => (
    <TouchableOpacity
      style={styles.duaCard}
      onPress={() => navigation.navigate('DuaDetail', { duaId: item.id })}
    >
      <View style={styles.duaHeader}>
        <Text style={styles.duaTitle}>{item.title}</Text>
        <Ionicons name="chevron-forward" size={20} color={Colors.text.secondary} />
      </View>
      <Text style={styles.duaOccasion}>{item.occasion}</Text>
      <Text style={styles.duaPreview} numberOfLines={1}>
        {item.transliteration}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Learn Islam</Text>
          <Text style={styles.subtitle}>
            Start your journey of knowledge
          </Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'modules' && styles.activeTab]}
            onPress={() => setActiveTab('modules')}
          >
            <Text style={[styles.tabText, activeTab === 'modules' && styles.activeTabText]}>
              Learning Modules
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'duas' && styles.activeTab]}
            onPress={() => setActiveTab('duas')}
          >
            <Text style={[styles.tabText, activeTab === 'duas' && styles.activeTabText]}>
              Essential Duas
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        {activeTab === 'modules' ? (
          <>
            <GradientCard
              colors={[Colors.accent, Colors.accentLight]}
              style={styles.tipCard}
            >
              <Ionicons name="bulb" size={24} color={Colors.text.light} />
              <Text style={styles.tipText}>
                Start with "The Five Pillars of Islam" to learn the fundamentals
              </Text>
            </GradientCard>

            <FlatList
              data={LEARNING_MODULES}
              renderItem={renderModule}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.modulesList}
            />
          </>
        ) : (
          <>
            <View style={styles.duaCategories}>
              <TouchableOpacity style={styles.duaCategory}>
                <Ionicons name="sunny" size={20} color={Colors.primary} />
                <Text style={styles.duaCategoryText}>Daily</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.duaCategory}>
                <Ionicons name="moon" size={20} color={Colors.primary} />
                <Text style={styles.duaCategoryText}>Prayer</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.duaCategory}>
                <Ionicons name="restaurant" size={20} color={Colors.primary} />
                <Text style={styles.duaCategoryText}>Food</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.duaCategory}>
                <Ionicons name="car" size={20} color={Colors.primary} />
                <Text style={styles.duaCategoryText}>Travel</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={ESSENTIAL_DUAS}
              renderItem={renderDua}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.duasList}
            />
          </>
        )}
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
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginTop: 4,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: Colors.border,
  },
  activeTab: {
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  tipCard: {
    margin: 20,
    marginTop: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: Colors.text.light,
    lineHeight: 22,
  },
  modulesList: {
    paddingHorizontal: 20,
  },
  moduleCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  moduleIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  moduleContent: {
    flex: 1,
  },
  moduleTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  moduleDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 4,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  duaCategories: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  duaCategory: {
    alignItems: 'center',
    padding: 12,
  },
  duaCategoryText: {
    fontSize: 14,
    color: Colors.text.primary,
    marginTop: 4,
  },
  duasList: {
    paddingHorizontal: 20,
  },
  duaCard: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  duaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  duaTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  duaOccasion: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 4,
  },
  duaPreview: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 8,
    fontStyle: 'italic',
  },
});

export default LearnScreen;