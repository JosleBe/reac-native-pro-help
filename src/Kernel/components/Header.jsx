import { Roboto_400Regular, Roboto_500Medium, Roboto_900Black, useFonts } from '@expo-google-fonts/roboto';
import React from 'react'
import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import { Icon } from 'react-native-elements';
import Colors from '../../utils/Colors';

const Header = ({name}) => {

    const [fontsLoaded] = useFonts({
        Roboto_400Regular,
        Roboto_500Medium,
        Roboto_900Black
    });

    return (
        <SafeAreaView >
            <View style={styles.header}>
                <Text style={styles.title}>{name}</Text>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#fff',
        padding: 5,
        width: '100%',
        height: 45,
        borderBottomWidth: 1,
        borderBottomColor: Colors.cielo,
     
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        fontFamily: 'Roboto_900Black',
        textAlign: 'center',
    }

});

export default Header
