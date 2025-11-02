import { View, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@theme/color';

type Props = { value: string; onChangeText: (v: string) => void; };

export default function SearchBar({ value, onChangeText }: Props) {
  return (
    <View
      style={{
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#fff', borderRadius: 16,
        paddingHorizontal: 12, height: 44, gap: 8,
        shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 }, elevation: 2,
        borderWidth: 1, borderColor: '#eee',
      }}
    >
      <Ionicons name="search-outline" size={18} color={colors.muted} />
      <TextInput
        placeholder="Search for products…"
        value={value}
        onChangeText={onChangeText}
        style={{ flex: 1, fontSize: 16 }}
        placeholderTextColor={colors.muted}
      />
    </View>
  );
}
