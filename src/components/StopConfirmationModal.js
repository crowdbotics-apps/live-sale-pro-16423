import React, {useState} from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';

const CLOSE_ICON = require('../../assets/images/close_icon.png');

export default function StopConfirmationModal({
  onStopStream,
  onStopStreamFacebook,
  onClose,
  visible,
}) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.centeredView}>
          <TouchableWithoutFeedback>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Stop stream</Text>

              <TouchableOpacity style={styles.button} onPress={onStopStream}>
                <Text style={styles.buttonText}>STOP STREAM</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={onStopStreamFacebook}>
                <Text style={styles.buttonText}>STOP STREAM TO FACEBOOK</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Image source={CLOSE_ICON} style={styles.closeIcon} />
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  centeredView: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  modalView: {
    margin: 20,
    backgroundColor: '#BA1F5C',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#DC226B',
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  modalText: {
    // marginBottom: 15,
    textAlign: 'center',
    color: '#fff',
    fontSize: 24,
    lineHeight: 40,
  },
  button: {
    backgroundColor: '#fff',
    marginTop: 30,
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    borderRadius: 50,
    paddingHorizontal: 25, // width: '100%'
  },
  buttonText: {
    color: '#464646',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 40,
  },
  closeButton: {
    position: 'absolute',
    top: 17,
    right: 19,
  },
});
