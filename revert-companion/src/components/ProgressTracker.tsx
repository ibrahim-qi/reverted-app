import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Progress } from '../types';

interface ProgressTrackerProps {
  progress: Progress;
  onViewAchievements?: () => void;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({ 
  progress, 
  onViewAchievements 
}) => {
  const getCurrentStreak = () => {
    return progress.streak;
  };

  const getTotalPrayers = () => {
    const total = Object.values(progress.dailyPrayers).reduce((sum, day) => {
      return sum + Object.values(day).filter(prayed => prayed).length;
    }, 0);
    return total;
  };

  const getCompletionRate = () => {
    const totalDays = Object.keys(progress.dailyPrayers).length;
    if (totalDays === 0) return 0;
    
    const completedDays = Object.values(progress.dailyPrayers).filter(day => 
      Object.values(day).every(prayed => prayed)
    ).length;
    
    return Math.round((completedDays / totalDays) * 100);
  };

  const getAchievements = () => {
    const achievements = [];
    
    if (progress.streak >= 7) {
      achievements.push({ 
        id: 'week', 
        title: 'Week Warrior', 
        description: '7-day prayer streak',
        icon: 'flame',
        unlocked: true 
      });
    }
    
    if (progress.streak >= 30) {
      achievements.push({ 
        id: 'month', 
        title: 'Monthly Master', 
        description: '30-day prayer streak',
        icon: 'trophy',
        unlocked: true 
      });
    }
    
    if (getTotalPrayers() >= 100) {
      achievements.push({ 
        id: 'century', 
        title: 'Century Club', 
        description: '100 prayers completed',
        icon: 'star',
        unlocked: true 
      });
    }
    
    if (progress.lessonsCompleted.length >= 10) {
      achievements.push({ 
        id: 'learner', 
        title: 'Dedicated Learner', 
        description: '10 lessons completed',
        icon: 'book',
        unlocked: true 
      });
    }
    
    // Add locked achievements
    if (progress.streak < 7) {
      achievements.push({ 
        id: 'week_locked', 
        title: 'Week Warrior', 
        description: '7-day prayer streak',
        icon: 'flame',
        unlocked: false 
      });
    }
    
    if (progress.streak < 30) {
      achievements.push({ 
        id: 'month_locked', 
        title: 'Monthly Master', 
        description: '30-day prayer streak',
        icon: 'trophy',
        unlocked: false 
      });
    }
    
    return achievements.slice(0, 6); // Show max 6 achievements
  };

  const achievements = getAchievements();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Progress</Text>
        {onViewAchievements && (
          <TouchableOpacity onPress={onViewAchievements}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Stats Overview */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <View style={styles.statIcon}>
            <Ionicons name="flame" size={24} color={Colors.secondary} />
          </View>
          <Text style={styles.statValue}>{getCurrentStreak()}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIcon}>
            <Ionicons name="checkmark-circle" size={24} color={Colors.secondary} />
          </View>
          <Text style={styles.statValue}>{getTotalPrayers()}</Text>
          <Text style={styles.statLabel}>Total Prayers</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIcon}>
            <Ionicons name="trophy" size={24} color={Colors.secondary} />
          </View>
          <Text style={styles.statValue}>{progress.totalPoints}</Text>
          <Text style={styles.statLabel}>Points Earned</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIcon}>
            <Ionicons name="trending-up" size={24} color={Colors.secondary} />
          </View>
          <Text style={styles.statValue}>{getCompletionRate()}%</Text>
          <Text style={styles.statLabel}>Completion Rate</Text>
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityList}>
          {progress.lessonsCompleted.slice(-3).reverse().map((lessonId, index) => (
            <View key={index} style={styles.activityItem}>
              <Ionicons name="book" size={16} color={Colors.primary} />
              <Text style={styles.activityText}>Completed lesson: {lessonId}</Text>
              <Text style={styles.activityTime}>+25 points</Text>
            </View>
          ))}
          {progress.lessonsCompleted.length === 0 && (
            <Text style={styles.noActivityText}>No recent activity</Text>
          )}
        </View>
      </View>

      {/* Achievements Preview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Achievements</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.achievementsContainer}>
            {achievements.map((achievement) => (
              <View 
                key={achievement.id} 
                style={[
                  styles.achievementCard,
                  !achievement.unlocked && styles.achievementLocked
                ]}
              >
                <Ionicons 
                  name={achievement.icon as any} 
                  size={24} 
                  color={achievement.unlocked ? Colors.secondary : Colors.text.disabled} 
                />
                <Text style={[
                  styles.achievementTitle,
                  !achievement.unlocked && styles.achievementTitleLocked
                ]}>
                  {achievement.title}
                </Text>
                <Text style={[
                  styles.achievementDescription,
                  !achievement.unlocked && styles.achievementDescriptionLocked
                ]}>
                  {achievement.description}
                </Text>
                {!achievement.unlocked && (
                  <Ionicons name="lock-closed" size={16} color={Colors.text.disabled} />
                )}
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Progress Tips */}
      <View style={styles.tipsContainer}>
        <Text style={styles.tipsTitle}>💡 Tips to Improve</Text>
        <Text style={styles.tipText}>
          • Set prayer reminders to maintain your streak{'\n'}
          • Complete daily lessons to earn more points{'\n'}
          • Pray in congregation when possible{'\n'}
          • Learn new duas and supplications
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  viewAllText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  activityList: {
    gap: 8,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: Colors.background,
    borderRadius: 8,
  },
  activityText: {
    flex: 1,
    fontSize: 14,
    color: Colors.text.primary,
    marginLeft: 8,
  },
  activityTime: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
  },
  noActivityText: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 20,
  },
  achievementsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  achievementCard: {
    backgroundColor: Colors.background,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 120,
    borderWidth: 2,
    borderColor: Colors.secondary,
  },
  achievementLocked: {
    borderColor: Colors.border,
    opacity: 0.6,
  },
  achievementTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.primary,
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  achievementTitleLocked: {
    color: Colors.text.disabled,
  },
  achievementDescription: {
    fontSize: 10,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  achievementDescriptionLocked: {
    color: Colors.text.disabled,
  },
  tipsContainer: {
    backgroundColor: Colors.primaryLight,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
});