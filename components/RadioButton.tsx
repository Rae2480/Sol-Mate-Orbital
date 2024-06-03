import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface RadioButtonProps {
  selected: boolean;
  onPress: () => void;
  selectedColor?: string; 
}

const RadioButton: React.FC<RadioButtonProps> = ({ selected, onPress, selectedColor = 'rgba(0,0,0,0.4)' }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={[styles.radioCircle, { borderColor: selected ? selectedColor : 'rgba(0,0,0,0.4)' }]}>
        {selected && <View style={[styles.selectedRb, { backgroundColor: selectedColor }]} />}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  selectedRb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  radioText: {
    fontSize: 16,
    color: '#000',
  },
});

export default RadioButton;

