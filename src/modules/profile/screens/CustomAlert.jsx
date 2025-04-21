import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const CustomAlert = ({ visible, onClose, title, message, type = 'info' }) => {
    const backgroundColor = {
        success: '#2ecc71',
        error: '#e74c3c',
        warning: '#f1c40f',
        info: '#3498db'
    }[type];

    return (
        <Modal
            transparent
            animationType="fade"
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={[styles.alertBox, { borderLeftColor: backgroundColor }]}>
                    <Text style={[styles.title, { color: backgroundColor }]}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>
                    <TouchableOpacity style={[styles.button, { backgroundColor }]} onPress={onClose}>
                        <Text style={styles.buttonText}>Aceptar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default CustomAlert;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    alertBox: {
        backgroundColor: '#fff',
        width: '80%',
        padding: 20,
        borderRadius: 10,
        elevation: 10,
        borderLeftWidth: 6,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    message: {
        fontSize: 16,
        color: '#555',
        marginBottom: 20,
    },
    button: {
        alignSelf: 'flex-end',
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 6,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
