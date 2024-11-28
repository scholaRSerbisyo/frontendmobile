import { View, StyleSheet } from 'react-native';
import { Calendar } from '~/components/Authentication/components/Calendar';

export default function CalendarScreen() {
  return (
    <View style={styles.container}>
      <Calendar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

