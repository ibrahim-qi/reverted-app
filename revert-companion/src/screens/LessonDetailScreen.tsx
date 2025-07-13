import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { Colors } from '../constants/colors';
import { GradientCard } from '../components/GradientCard';
import { LEARNING_MODULES } from '../constants/learningContent';
import { markLessonComplete } from '../utils/storage';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Lesson, LearningModule } from '../types';

type RouteParams = RouteProp<RootStackParamList, 'LessonDetail'>;
type NavigationProp = StackNavigationProp<RootStackParamList>;

const LessonDetailScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteParams>();
  const { moduleId, lessonId } = route.params;

  const [module, setModule] = useState<LearningModule | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);

  useEffect(() => {
    loadLesson();
  }, [lessonId]);

  const loadLesson = () => {
    const foundModule = LEARNING_MODULES.find(m => m.id === moduleId);
    if (foundModule) {
      setModule(foundModule);
      const lessonIndex = foundModule.lessons.findIndex(l => l.id === lessonId);
      if (lessonIndex !== -1) {
        setLesson(foundModule.lessons[lessonIndex]);
        setCurrentLessonIndex(lessonIndex);
      }
    }
  };

  const markComplete = async () => {
    if (lesson && !lesson.completed) {
      await markLessonComplete(lesson.id);
      lesson.completed = true;
      setLesson({ ...lesson });
    }
  };

  const navigateToLesson = (index: number) => {
    if (module && index >= 0 && index < module.lessons.length) {
      navigation.replace('LessonDetail', {
        moduleId: module.id,
        lessonId: module.lessons[index].id,
      });
    }
  };

  const renderContent = () => {
    if (!lesson) return null;

    const paragraphs = lesson.content.split('\n\n');
    
    return paragraphs.map((paragraph, index) => {
      // Check if it's a heading (starts with **)
      if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
        const heading = paragraph.slice(2, -2);
        return (
          <Text key={index} style={styles.heading}>
            {heading}
          </Text>
        );
      }
      
      // Check if it contains bullet points
      if (paragraph.includes('•')) {
        const lines = paragraph.split('\n');
        return (
          <View key={index} style={styles.bulletList}>
            {lines.map((line, lineIndex) => {
              if (line.trim().startsWith('•')) {
                return (
                  <View key={lineIndex} style={styles.bulletItem}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.bulletText}>
                      {line.replace('•', '').trim()}
                    </Text>
                  </View>
                );
              }
              return (
                <Text key={lineIndex} style={styles.paragraph}>
                  {line}
                </Text>
              );
            })}
          </View>
        );
      }
      
      // Regular paragraph
      return (
        <Text key={index} style={styles.paragraph}>
          {paragraph}
        </Text>
      );
    });
  };

  if (!module || !lesson) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loading}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Module Info */}
        <GradientCard
          colors={[Colors.primary, Colors.primaryLight]}
          style={styles.moduleCard}
        >
          <Text style={styles.moduleTitle}>{module.title}</Text>
          <Text style={styles.lessonProgress}>
            Lesson {currentLessonIndex + 1} of {module.lessons.length}
          </Text>
        </GradientCard>

        {/* Lesson Content */}
        <View style={styles.content}>
          <Text style={styles.lessonTitle}>{lesson.title}</Text>
          <View style={styles.metadata}>
            <Ionicons name="time-outline" size={16} color={Colors.text.secondary} />
            <Text style={styles.duration}>{lesson.duration} min read</Text>
            {lesson.completed && (
              <>
                <Ionicons 
                  name="checkmark-circle" 
                  size={16} 
                  color={Colors.accent} 
                  style={styles.completedIcon}
                />
                <Text style={styles.completedText}>Completed</Text>
              </>
            )}
          </View>

          <View style={styles.lessonContent}>
            {renderContent()}
          </View>

          {/* Mark Complete Button */}
          {!lesson.completed && (
            <TouchableOpacity
              style={styles.completeButton}
              onPress={markComplete}
            >
              <Ionicons name="checkmark-circle-outline" size={24} color={Colors.text.light} />
              <Text style={styles.completeButtonText}>Mark as Complete</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Navigation */}
        <View style={styles.navigation}>
          <TouchableOpacity
            style={[
              styles.navButton,
              currentLessonIndex === 0 && styles.navButtonDisabled,
            ]}
            onPress={() => navigateToLesson(currentLessonIndex - 1)}
            disabled={currentLessonIndex === 0}
          >
            <Ionicons 
              name="arrow-back" 
              size={20} 
              color={currentLessonIndex === 0 ? Colors.text.disabled : Colors.primary} 
            />
            <Text 
              style={[
                styles.navButtonText,
                currentLessonIndex === 0 && styles.navButtonTextDisabled,
              ]}
            >
              Previous
            </Text>
          </TouchableOpacity>

          <View style={styles.lessonDots}>
            {module.lessons.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === currentLessonIndex && styles.dotActive,
                  module.lessons[index].completed && styles.dotCompleted,
                ]}
              />
            ))}
          </View>

          <TouchableOpacity
            style={[
              styles.navButton,
              currentLessonIndex === module.lessons.length - 1 && styles.navButtonDisabled,
            ]}
            onPress={() => navigateToLesson(currentLessonIndex + 1)}
            disabled={currentLessonIndex === module.lessons.length - 1}
          >
            <Text 
              style={[
                styles.navButtonText,
                currentLessonIndex === module.lessons.length - 1 && styles.navButtonTextDisabled,
              ]}
            >
              Next
            </Text>
            <Ionicons 
              name="arrow-forward" 
              size={20} 
              color={currentLessonIndex === module.lessons.length - 1 ? Colors.text.disabled : Colors.primary} 
            />
          </TouchableOpacity>
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
  moduleCard: {
    margin: 20,
    marginBottom: 0,
  },
  moduleTitle: {
    fontSize: 16,
    color: Colors.text.light,
    opacity: 0.9,
  },
  lessonProgress: {
    fontSize: 14,
    color: Colors.text.light,
    opacity: 0.8,
    marginTop: 4,
  },
  content: {
    padding: 20,
  },
  lessonTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  duration: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: 4,
  },
  completedIcon: {
    marginLeft: 16,
  },
  completedText: {
    fontSize: 14,
    color: Colors.accent,
    marginLeft: 4,
  },
  lessonContent: {
    marginBottom: 24,
  },
  paragraph: {
    fontSize: 16,
    color: Colors.text.primary,
    lineHeight: 24,
    marginBottom: 16,
  },
  heading: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 12,
    marginTop: 8,
  },
  bulletList: {
    marginBottom: 16,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  bullet: {
    fontSize: 16,
    color: Colors.primary,
    marginRight: 8,
  },
  bulletText: {
    flex: 1,
    fontSize: 16,
    color: Colors.text.primary,
    lineHeight: 24,
  },
  completeButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.light,
    marginLeft: 8,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 16,
    color: Colors.primary,
    marginHorizontal: 4,
  },
  navButtonTextDisabled: {
    color: Colors.text.disabled,
  },
  lessonDots: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.border,
  },
  dotActive: {
    backgroundColor: Colors.primary,
    width: 24,
  },
  dotCompleted: {
    backgroundColor: Colors.accent,
  },
});

export default LessonDetailScreen;