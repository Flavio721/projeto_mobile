import React, { useState, useEffect } from "react";
import { Text, View, FlatList, StyleSheet } from "react-native";
import * as Contacts from "expo-contacts";

export default function ListContacts() {
  const [contacts, setContacts] = useState([]);
  const [hasPermission, setPermission] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      setPermission(status === "granted");

      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Emails, ],
        });
        if (data.length > 0) {
          setContacts(data);
        }
      }
    })();
  }, []);

  if (hasPermission === null) return <View />;
  if (hasPermission === false) return <Text>Acesso aos contatos negado</Text>;

  // filtro direto na hora de renderizar, sem estado separado
  const contatosFiltrados = contacts.filter((contato) =>
    contato.name?.toLowerCase().startsWith("l")
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={contatosFiltrados}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.name}>{item.firstName}</Text>
            {item.phoneNumbers &&
              item.phoneNumbers.map((phone, index) => (
                <Text key={index} style={styles.number}>
                  {phone.number}
                </Text>
              ))}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222",
  },
  row: {
    width: "100%",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#bbb",
    paddingBottom: 10,
    paddingLeft: 10,
  },
  name: {
    color: "yellow",
  },
  number: {
    color: "#fff",
  },
});