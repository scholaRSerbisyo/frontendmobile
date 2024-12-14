import React from 'react'
import { View, TextInput, StyleSheet, ViewStyle, TextStyle } from 'react-native'
import { Search } from 'lucide-react-native'

interface SearchBarProps {
  value: string
  onChangeText: (text: string) => void
  placeholder?: string
  containerStyle?: ViewStyle
  inputStyle?: TextStyle
}

export function SearchBar({ 
  value, 
  onChangeText, 
  placeholder = 'Search',
  containerStyle,
  inputStyle
}: SearchBarProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      <Search size={14} color="#A0A0A0" style={styles.icon} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#A0A0A0"
        style={[styles.input, inputStyle]}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: "20%",
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
    padding: 0,
  },
})

