import React from "react";
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
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
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

  const getInputStyle = (inputId: string) => {
    return [styles.input, focusedInput === inputId && styles.inputFocused];
  };

  return (
    <>
      <style>
        {`
          input:focus {
            outline: none !important;
            -webkit-appearance: none !important;
            box-shadow: none !important;
            background-color: #FFFFFF !important;
          }
          input {
            -webkit-tap-highlight-color: transparent;
          }
        `}
      </style>
      <ScrollView style={styles.container}>
        <ThemedView style={styles.languageSelector}>
          <View style={styles.languagePicker}>
            <ThemedText style={styles.fieldLabel}>
              <ThemedText style={styles.fieldLabelText}>Language</ThemedText>
            </ThemedText>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={currentLanguage}
                onValueChange={(value) => setCurrentLanguage(value as Language)}
                style={styles.picker}
                dropdownIconColor='#2F4F4F'
              >
                {availableLanguages.map(([code, lang]) => (
                  <Picker.Item
                    key={code}
                    label={lang.nativeName}
                    value={code}
                  />
                ))}
              </Picker>
            </View>
          </View>
        </ThemedView>

        <ThemedView style={styles.form}>
          <ThemedText style={styles.title}>
            <ThemedText style={styles.titleText}>{t.title}</ThemedText>
          </ThemedText>

          {/* Basic Information */}
          <ThemedView style={styles.section}>
            <ThemedView style={styles.rowContainer}>
              <ThemedView style={styles.fieldContainer}>
                <ThemedText style={styles.fieldLabel}>
                  <ThemedText style={styles.fieldLabelText}>
                    {t.name}
                  </ThemedText>
                </ThemedText>
                <TextInput
                  style={getInputStyle("name")}
                  value={characterData.name}
                  onChangeText={(value) => updateCharacterField("name", value)}
                  onFocus={() => setFocusedInput("name")}
                  onBlur={() => setFocusedInput(null)}
                />
              </ThemedView>

              <ThemedView style={styles.fieldContainer}>
                <ThemedText style={styles.fieldLabel}>
                  <ThemedText style={styles.fieldLabelText}>
                    {t.nationality}
                  </ThemedText>
                </ThemedText>
                <TextInput
                  style={getInputStyle("nationality")}
                  value={characterData.nationality}
                  onChangeText={(value) =>
                    updateCharacterField("nationality", value)
                  }
                  onFocus={() => setFocusedInput("nationality")}
                  onBlur={() => setFocusedInput(null)}
                />
              </ThemedView>

              <ThemedView style={styles.fieldContainer}>
                <ThemedText style={styles.fieldLabel}>
                  <ThemedText style={styles.fieldLabelText}>
                    {t.rank}
                  </ThemedText>
                </ThemedText>
                <TextInput
                  style={getInputStyle("rank")}
                  value={characterData.rank}
                  onChangeText={(value) => updateCharacterField("rank", value)}
                  onFocus={() => setFocusedInput("rank")}
                  onBlur={() => setFocusedInput(null)}
                />
              </ThemedView>
            </ThemedView>

            <ThemedView style={styles.rowContainer}>
              <ThemedView style={styles.fieldContainer}>
                <ThemedText style={styles.fieldLabel}>
                  <ThemedText style={styles.fieldLabelText}>
                    {t.archetype}
                  </ThemedText>
                </ThemedText>
                <TextInput
                  style={getInputStyle("archetype")}
                  value={characterData.archetype}
                  onChangeText={(value) =>
                    updateCharacterField("archetype", value)
                  }
                  onFocus={() => setFocusedInput("archetype")}
                  onBlur={() => setFocusedInput(null)}
                />
              </ThemedView>

              <ThemedView style={styles.fieldContainer}>
                <ThemedText style={styles.fieldLabel}>
                  <ThemedText style={styles.fieldLabelText}>
                    {t.background}
                  </ThemedText>
                </ThemedText>
                <TextInput
                  style={getInputStyle("background")}
                  value={characterData.background}
                  onChangeText={(value) =>
                    updateCharacterField("background", value)
                  }
                  onFocus={() => setFocusedInput("background")}
                  onBlur={() => setFocusedInput(null)}
                />
              </ThemedView>

              <ThemedView style={styles.fieldContainer}>
                <ThemedText style={styles.fieldLabel}>
                  <ThemedText style={styles.fieldLabelText}>
                    {t.personality}
                  </ThemedText>
                </ThemedText>
                <TextInput
                  style={getInputStyle("personality")}
                  value={characterData.personality}
                  onChangeText={(value) =>
                    updateCharacterField("personality", value)
                  }
                  onFocus={() => setFocusedInput("personality")}
                  onBlur={() => setFocusedInput(null)}
                />
              </ThemedView>
            </ThemedView>
          </ThemedView>

          {/* Personal Traits Section */}
          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>
              <ThemedText style={styles.titleText}>
                {t.personalTraits}
              </ThemedText>
            </ThemedText>
            <ThemedView style={styles.rowContainer}>
              {characterData.personalTraits.map((trait, index) => (
                <ThemedView key={index} style={styles.traitContainer}>
                  <TextInput
                    style={[
                      styles.traitInput,
                      { minHeight: 75 },
                      focusedInput === `trait-${index}` && styles.inputFocused,
                    ]}
                    value={trait}
                    onChangeText={(value) => {
                      const newTraits = [...characterData.personalTraits];
                      newTraits[index] = value;
                      updateCharacterField("personalTraits", newTraits);
                    }}
                    onFocus={() => setFocusedInput(`trait-${index}`)}
                    onBlur={() => setFocusedInput(null)}
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
                      onValueChange={(value) =>
                        updateAttributeScore(attr, value)
                      }
                      style={styles.picker}
                      dropdownIconColor='#000'
                    >
                      <Picker.Item label='-' value='' />
                      {Array.from({ length: 20 }, (_, i) => i + 6).map(
                        (num) => (
                          <Picker.Item
                            key={num}
                            label={num.toString()}
                            value={num.toString()}
                          />
                        )
                      )}
                    </Picker>
                  </View>
                  <TextInput
                    style={[
                      styles.attributeInput,
                      focusedInput === `attr-${attr}` && styles.inputFocused,
                    ]}
                    value={characterData.attributes[attr].extraDamage}
                    editable={false}
                    placeholder='Extra'
                    onFocus={() => setFocusedInput(`attr-${attr}`)}
                    onBlur={() => setFocusedInput(null)}
                  />
                </ThemedView>
              ))}
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  languageSelector: {
    marginBottom: 20,
    alignItems: "flex-end",
  },
  languagePicker: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    maxWidth: 300,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#90AA83",
    borderRadius: 4,
    height: 40,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    width: 150,
  },
  picker: {
    height: 40,
    width: "100%",
  },
  form: {
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#F5F5F0",
    backgroundColor: "#2F4F4F",
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: "flex-start",
    transform: [{ skewX: "-15deg" }],
  },
  section: {
    marginBottom: 24,
    backgroundColor: "#f5f5f5",
    padding: 16,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#F5F5F0",
    marginBottom: 16,
    textTransform: "uppercase",
    letterSpacing: 1,
    backgroundColor: "#2F4F4F",
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: "flex-start",
    transform: [{ skewX: "-15deg" }],
  },
  titleText: {
    transform: [{ skewX: "15deg" }],
    color: "#F5F5F0",
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFF0",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    backgroundColor: "#2F4F4F",
    paddingVertical: 4,
    paddingHorizontal: 12,
    alignSelf: "flex-start",
    transform: [{ skewX: "-15deg" }],
  },
  fieldLabelText: {
    transform: [{ skewX: "15deg" }],
    color: "#FFFFF0",
  },
  input: Platform.select({
    web: {
      borderWidth: 1,
      borderColor: "#90AA83",
      borderRadius: 4,
      padding: 12,
      marginBottom: 12,
      backgroundColor: "#FFFFFF",
      fontSize: 16,
      outline: "none",
      height: 40,
      WebkitTapHighlightColor: "transparent",
      "&:focus": {
        outline: "none",
        WebkitAppearance: "none",
        boxShadow: "none",
      },
    },
    default: {
      borderWidth: 1,
      borderColor: "#90AA83",
      borderRadius: 4,
      padding: 12,
      marginBottom: 12,
      backgroundColor: "#FFFFFF",
      fontSize: 16,
      height: 40,
    },
  }),
  inputFocused: {
    borderWidth: 2,
    margin: -1,
  },
  rowContainer: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  fieldContainer: {
    flex: 1,
    height: 90,
  },
  attributesContainer: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 8,
  },
  rowTitlesColumn: {
    gap: 12,
    width: 100,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2F4F4F",
    textAlign: "center",
    height: 40,
    textAlignVertical: "center",
    width: "100%",
    textTransform: "uppercase",
  },
  attributeColumn: {
    flex: 1,
    gap: 12,
    minWidth: 80,
  },
  attributeName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#556B2F",
    textAlign: "center",
    height: 40,
    textAlignVertical: "center",
    textTransform: "uppercase",
  },
  attributeInput: Platform.select({
    web: {
      borderWidth: 1,
      borderColor: "#90AA83",
      borderRadius: 4,
      padding: 8,
      textAlign: "center",
      height: 40,
      backgroundColor: "#FFFFFF",
      outline: "none",
      WebkitTapHighlightColor: "transparent",
      "&:focus": {
        outline: "none",
        WebkitAppearance: "none",
        boxShadow: "none",
      },
    },
    default: {
      borderWidth: 1,
      borderColor: "#90AA83",
      borderRadius: 4,
      padding: 8,
      textAlign: "center",
      height: 40,
      backgroundColor: "#FFFFFF",
    },
  }),
  traitContainer: {
    flex: 1,
    minHeight: 75,
  },
  traitInput: Platform.select({
    web: {
      borderWidth: 1,
      borderColor: "#90AA83",
      borderRadius: 4,
      padding: 8,
      textAlignVertical: "top",
      outline: "none",
      WebkitTapHighlightColor: "transparent",
      "&:focus": {
        outline: "none",
        WebkitAppearance: "none",
        boxShadow: "none",
      },
    },
    default: {
      borderWidth: 1,
      borderColor: "#90AA83",
      borderRadius: 4,
      padding: 8,
      textAlignVertical: "top",
    },
  }),
});
