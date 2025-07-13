import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';

interface ZakatCalculatorProps {
  onClose?: () => void;
}

export const ZakatCalculator: React.FC<ZakatCalculatorProps> = ({ onClose }) => {
  const [values, setValues] = useState({
    cash: '',
    gold: '',
    silver: '',
    stocks: '',
    business: '',
    other: '',
  });

  const [zakatAmount, setZakatAmount] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  // Current gold and silver prices (approximate, should be updated regularly)
  const GOLD_PRICE_PER_GRAM = 70; // USD per gram
  const SILVER_PRICE_PER_GRAM = 0.8; // USD per gram

  // Nisab thresholds (minimum amount for Zakat)
  const GOLD_NISAB_GRAMS = 87.48; // 87.48 grams of gold
  const SILVER_NISAB_GRAMS = 612.36; // 612.36 grams of silver

  const calculateZakat = () => {
    const cash = parseFloat(values.cash) || 0;
    const gold = parseFloat(values.gold) || 0;
    const silver = parseFloat(values.silver) || 0;
    const stocks = parseFloat(values.stocks) || 0;
    const business = parseFloat(values.business) || 0;
    const other = parseFloat(values.other) || 0;

    const goldValue = gold * GOLD_PRICE_PER_GRAM;
    const silverValue = silver * SILVER_PRICE_PER_GRAM;
    
    const totalWealth = cash + goldValue + silverValue + stocks + business + other;
    
    // Check if wealth meets nisab threshold
    const goldNisabValue = GOLD_NISAB_GRAMS * GOLD_PRICE_PER_GRAM;
    const silverNisabValue = SILVER_NISAB_GRAMS * SILVER_PRICE_PER_GRAM;
    const nisabThreshold = Math.min(goldNisabValue, silverNisabValue);

    if (totalWealth < nisabThreshold) {
      setZakatAmount(0);
    } else {
      // Zakat is 2.5% of total wealth
      setZakatAmount(totalWealth * 0.025);
    }
    
    setShowResult(true);
  };

  const resetCalculator = () => {
    setValues({
      cash: '',
      gold: '',
      silver: '',
      stocks: '',
      business: '',
      other: '',
    });
    setZakatAmount(null);
    setShowResult(false);
  };

  const updateValue = (field: keyof typeof values, value: string) => {
    setValues(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Zakat Calculator</Text>
        {onClose && (
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={Colors.text.primary} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.description}>
          Calculate your Zakat obligation (2.5% of wealth above nisab threshold)
        </Text>

        <View style={styles.inputSection}>
          <Text style={styles.sectionTitle}>Your Wealth</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Cash & Bank Accounts</Text>
            <TextInput
              style={styles.input}
              value={values.cash}
              onChangeText={(value) => updateValue('cash', value)}
              placeholder="0.00"
              keyboardType="numeric"
              placeholderTextColor={Colors.text.disabled}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Gold (grams)</Text>
            <TextInput
              style={styles.input}
              value={values.gold}
              onChangeText={(value) => updateValue('gold', value)}
              placeholder="0.00"
              keyboardType="numeric"
              placeholderTextColor={Colors.text.disabled}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Silver (grams)</Text>
            <TextInput
              style={styles.input}
              value={values.silver}
              onChangeText={(value) => updateValue('silver', value)}
              placeholder="0.00"
              keyboardType="numeric"
              placeholderTextColor={Colors.text.disabled}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Stocks & Investments</Text>
            <TextInput
              style={styles.input}
              value={values.stocks}
              onChangeText={(value) => updateValue('stocks', value)}
              placeholder="0.00"
              keyboardType="numeric"
              placeholderTextColor={Colors.text.disabled}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Business Assets</Text>
            <TextInput
              style={styles.input}
              value={values.business}
              onChangeText={(value) => updateValue('business', value)}
              placeholder="0.00"
              keyboardType="numeric"
              placeholderTextColor={Colors.text.disabled}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Other Assets</Text>
            <TextInput
              style={styles.input}
              value={values.other}
              onChangeText={(value) => updateValue('other', value)}
              placeholder="0.00"
              keyboardType="numeric"
              placeholderTextColor={Colors.text.disabled}
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.calculateButton} onPress={calculateZakat}>
            <Text style={styles.calculateButtonText}>Calculate Zakat</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.resetButton} onPress={resetCalculator}>
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
        </View>

        {showResult && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>Zakat Amount</Text>
            <Text style={styles.resultAmount}>
              ${zakatAmount?.toFixed(2) || '0.00'}
            </Text>
            {zakatAmount === 0 ? (
              <Text style={styles.resultMessage}>
                Your wealth is below the nisab threshold. No Zakat is due.
              </Text>
            ) : (
              <Text style={styles.resultMessage}>
                This is 2.5% of your total wealth above the nisab threshold.
              </Text>
            )}
          </View>
        )}

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Important Notes:</Text>
          <Text style={styles.infoText}>
            • Zakat is 2.5% of wealth held for one lunar year{'\n'}
            • Nisab threshold: ~$6,125 (based on silver value){'\n'}
            • Consult with a local scholar for specific guidance{'\n'}
            • This calculator is for estimation purposes only
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    margin: 20,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  closeButton: {
    padding: 5,
  },
  content: {
    padding: 20,
  },
  description: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 20,
    lineHeight: 20,
  },
  inputSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 15,
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.text.primary,
    backgroundColor: Colors.background,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  calculateButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 8,
    marginRight: 10,
    alignItems: 'center',
  },
  calculateButtonText: {
    color: Colors.text.light,
    fontSize: 16,
    fontWeight: '600',
  },
  resetButton: {
    backgroundColor: Colors.background,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  resetButtonText: {
    color: Colors.text.primary,
    fontSize: 16,
    fontWeight: '500',
  },
  resultContainer: {
    backgroundColor: Colors.primaryLight,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 10,
  },
  resultAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 10,
  },
  resultMessage: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  infoContainer: {
    backgroundColor: Colors.background,
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: Colors.secondary,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 12,
    color: Colors.text.secondary,
    lineHeight: 18,
  },
});