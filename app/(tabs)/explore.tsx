import {
  StyleSheet,
  Platform,
  TextInput,
  ScrollView,
  View,
  Pressable,
  Modal,
} from "react-native";
import { useState } from "react";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import translations from "../i18n/characterSheet.json";
import { Picker } from "@react-native-picker/picker";

type Language = keyof typeof translations;
type TranslationKeys = (typeof translations)[Language]["translations"];

interface AttributeValue {
  score: string;
  extraDamage: string;
}

// Character attributes (using English keys)
const attributes = [
  "AGILITY",
  "COORDINATION",
  "STRENGTH",
  "INSIGHT",
  "REASON",
  "WILL",
] as const;

type Attribute = (typeof attributes)[number];

type CharacterData = {
  name: string;
  nationality: string;
  rank: string;
  archetype: string;
  background: string;
  personality: string;
  personalTraits: string[];
  stress: boolean[];
  courage: string;
  wounds: string;
  armor: string;
  fortune: string;
  languages: string;
  attributes: Record<Attribute, AttributeValue>;
};

export default function ExploreScreen() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>("ca");
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [characterData, setCharacterData] = useState<CharacterData>({
    name: "",
    nationality: "",
    rank: "",
    archetype: "",
    background: "",
    personality: "",
    personalTraits: ["", "", "", "", ""],
    stress: Array(12).fill(false),
    courage: "",
    wounds: "",
    armor: "",
    fortune: "",
    languages: "",
    attributes: Object.fromEntries(
      attributes.map((attr) => [attr, { score: "", extraDamage: "" }])
    ) as Record<Attribute, AttributeValue>,
  });

  const t = translations[currentLanguage].translations;
  const availableLanguages = Object.entries(translations);

  const calculateExtraValue = (score: string): string => {
    if (!score) return "";
    const numScore = parseInt(score);
    if (numScore < 8) return "0";
    if (numScore === 9) return "1";
    if (numScore >= 10 && numScore <= 11) return "2";
    if (numScore >= 12 && numScore <= 13) return "3";
    if (numScore >= 14 && numScore <= 15) return "4";
    if (numScore >= 16) return "5";
    return "0";
  };

  const updateCharacterField = (field: keyof CharacterData, value: any) => {
    setCharacterData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateAttributeScore = (attr: Attribute, score: string) => {
    const extraValue = calculateExtraValue(score);
    console.log(`Updating ${attr}: score=${score}, extra=${extraValue}`); // Debug log
    setCharacterData((prev) => {
      const newAttributes = {
        ...prev.attributes,
        [attr]: {
          score: score,
          extraDamage: extraValue,
        },
      };
      console.log("New attributes:", newAttributes); // Debug log
      return {
        ...prev,
        attributes: newAttributes,
      };
    });
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.languageSelector}>
        <View style={styles.picker}>
          <ThemedText>
            {availableLanguages.map(([code, lang]) => lang.name).join(" / ")}:
          </ThemedText>
          <Pressable onPress={() => setShowLanguageModal(true)}>
            <ThemedText style={styles.languageButton}>
              {translations[currentLanguage].nativeName}
            </ThemedText>
          </Pressable>
        </View>
      </ThemedView>

      <Modal
        visible={showLanguageModal}
        transparent={true}
        animationType='slide'
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <View style={styles.modalOverlay}>
          <ThemedView style={styles.modalContent}>
            <ThemedText style={styles.modalTitle}>Select Language</ThemedText>
            {availableLanguages.map(([code, lang]) => (
              <Pressable
                key={code}
                style={styles.languageOption}
                onPress={() => {
                  setCurrentLanguage(code as Language);
                  setShowLanguageModal(false);
                }}
              >
                <ThemedText
                  style={[
                    styles.languageOptionText,
                    currentLanguage === code && styles.selectedLanguage,
                  ]}
                >
                  {lang.name} ({lang.nativeName})
                </ThemedText>
              </Pressable>
            ))}
          </ThemedView>
        </View>
      </Modal>

      <ThemedView style={styles.form}>
        <ThemedText style={styles.title}>{t.title}</ThemedText>

        {/* Basic Information */}
        <ThemedView style={styles.section}>
          <ThemedView style={styles.rowContainer}>
            <ThemedView style={styles.fieldContainer}>
              <ThemedText>{t.name}</ThemedText>
              <TextInput
                style={styles.input}
                value={characterData.name}
                onChangeText={(value) => updateCharacterField("name", value)}
              />
            </ThemedView>

            <ThemedView style={styles.fieldContainer}>
              <ThemedText>{t.nationality}</ThemedText>
              <TextInput
                style={styles.input}
                value={characterData.nationality}
                onChangeText={(value) =>
                  updateCharacterField("nationality", value)
                }
              />
            </ThemedView>

            <ThemedView style={styles.fieldContainer}>
              <ThemedText>{t.rank}</ThemedText>
              <TextInput
                style={styles.input}
                value={characterData.rank}
                onChangeText={(value) => updateCharacterField("rank", value)}
              />
            </ThemedView>
          </ThemedView>

          <ThemedView style={styles.rowContainer}>
            <ThemedView style={styles.fieldContainer}>
              <ThemedText>{t.archetype}</ThemedText>
              <TextInput
                style={styles.input}
                value={characterData.archetype}
                onChangeText={(value) =>
                  updateCharacterField("archetype", value)
                }
              />
            </ThemedView>

            <ThemedView style={styles.fieldContainer}>
              <ThemedText>{t.background}</ThemedText>
              <TextInput
                style={styles.input}
                value={characterData.background}
                onChangeText={(value) =>
                  updateCharacterField("background", value)
                }
              />
            </ThemedView>

            <ThemedView style={styles.fieldContainer}>
              <ThemedText>{t.personality}</ThemedText>
              <TextInput
                style={styles.input}
                value={characterData.personality}
                onChangeText={(value) =>
                  updateCharacterField("personality", value)
                }
              />
            </ThemedView>
          </ThemedView>
        </ThemedView>

        {/* Personal Traits Section */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>
            {t.personalTraits}
          </ThemedText>
          <ThemedView style={styles.rowContainer}>
            {characterData.personalTraits.map((trait, index) => (
              <ThemedView key={index} style={styles.traitContainer}>
                <TextInput
                  style={[styles.traitInput, { minHeight: 75 }]}
                  value={trait}
                  onChangeText={(value) => {
                    const newTraits = [...characterData.personalTraits];
                    newTraits[index] = value;
                    updateCharacterField("personalTraits", newTraits);
                  }}
                  multiline
                  numberOfLines={3}
                  textAlignVertical='top'
                />
              </ThemedView>
            ))}
          </ThemedView>
        </ThemedView>

        {/* Attributes Section */}
        <ThemedView style={styles.section}>
          <ThemedView style={styles.attributesContainer}>
            {/* Row Titles Column */}
            <ThemedView style={styles.rowTitlesColumn}>
              <ThemedText style={styles.rowTitle}>
                {t.attributeLabels.attribute}
              </ThemedText>
              <ThemedText style={styles.rowTitle}>
                {t.attributeLabels.score}
              </ThemedText>
              <ThemedText style={styles.rowTitle}>
                {t.attributeLabels.extra}
              </ThemedText>
            </ThemedView>

            {/* Attribute Data Columns */}
            {attributes.map((attr) => (
              <ThemedView key={attr} style={styles.attributeColumn}>
                <ThemedText style={styles.attributeName} numberOfLines={1}>
                  {t.attributes[attr]}
                </ThemedText>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={characterData.attributes[attr].score}
                    onValueChange={(value) => updateAttributeScore(attr, value)}
                    style={styles.picker}
                    dropdownIconColor='#000'
                  >
                    <Picker.Item label='-' value='' />
                    {Array.from({ length: 20 }, (_, i) => i + 6).map((num) => (
                      <Picker.Item
                        key={num}
                        label={num.toString()}
                        value={num.toString()}
                      />
                    ))}
                  </Picker>
                </View>
                <TextInput
                  style={styles.attributeInput}
                  value={characterData.attributes[attr].extraDamage}
                  editable={false}
                  placeholder='Extra'
                />
              </ThemedView>
            ))}
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  languageSelector: {
    marginBottom: 20,
  },
  picker: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  languageButton: {
    color: "#007AFF",
    fontSize: 16,
  },
  form: {
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  section: {
    gap: 8,
  },
  rowContainer: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "space-between",
  },
  fieldContainer: {
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
  },
  attributesContainer: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  rowTitlesColumn: {
    gap: 12,
    width: 100,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    height: 40,
    textAlignVertical: "center",
    width: "100%",
  },
  attributeColumn: {
    flex: 1,
    gap: 12,
    minWidth: 80,
  },
  attributeName: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    height: 40,
    textAlignVertical: "center",
    width: "100%",
  },
  attributeInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    textAlign: "center",
    height: 40,
    textAlignVertical: "center",
    width: "100%",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    borderRadius: 10,
    gap: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  languageOption: {
    padding: 15,
    borderRadius: 5,
  },
  languageOptionText: {
    fontSize: 16,
  },
  selectedLanguage: {
    color: "#007AFF",
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  traitContainer: {
    flex: 1,
  },
  traitInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    textAlignVertical: "top",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    height: 40,
    overflow: "hidden",
  },
  picker: {
    height: 40,
    width: "100%",
  },
});
