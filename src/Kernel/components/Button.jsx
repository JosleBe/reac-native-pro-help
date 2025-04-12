import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const Button = ({
  onPress,
  title,
  style,
  textStyle,
  disabled,
  buttonColor,
  textColor,
  disabledColor,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        style,
        { backgroundColor: disabled ? disabledColor : buttonColor },
      ]}
      disabled={disabled}
    >
      <Text
        style={[
          styles.text,
          textStyle,
          { color: disabled ? '#A0A0A0' : textColor },
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

Button.propTypes = {
  onPress: PropTypes.func.isRequired, // Asegura que onPress sea una función
  title: PropTypes.string.isRequired, // Asegura que el título sea una cadena
  style: PropTypes.object, // Estilo opcional del botón
  textStyle: PropTypes.object, // Estilo opcional del texto
  disabled: PropTypes.bool, // Propiedad opcional para desactivar el botón
  buttonColor: PropTypes.string, // Color del fondo del botón
  textColor: PropTypes.string, // Color del texto del botón
  disabledColor: PropTypes.string, // Color del fondo del botón cuando está deshabilitado
};

Button.defaultProps = {
  style: {},
  textStyle: {},
  disabled: false,
  buttonColor: '#6200EE', // Color por defecto del botón
  textColor: '#fff', // Color por defecto del texto
  disabledColor: '#E0E0E0', // Color por defecto del fondo cuando el botón está deshabilitado
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Button;
