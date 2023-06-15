/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState} from 'react';
import type {PropsWithChildren} from 'react';
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
  Pressable,
  Dimensions,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const [playListData, setPlayListData] = useState();
  const [playListTracksData, setPlayListTracksData] = useState();
  const [selectedTrack, setSelectedTrack] = useState();
  const [spotifyToken, setSpotifyToken] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTrackVisible, setModalTrackVisible] = useState(false);
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  let formData = new FormData();

  // formData.append('grant_type', 'client_credentials');
  formData.append('client_id', '9669a28dbfa04beeb07566c4b855a6d7');
  formData.append('client_secret', '4899932f3ea348fc9f6569a08aaba305');
  const getToken = () => {
    fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        // Authorization:
        //   'Basic 9669a28dbfa04beeb07566c4b855a6d7' +
        //   ':' +
        //   '4899932f3ea348fc9f6569a08aaba305',
      },
      body: 'grant_type=client_credentials&client_id=9669a28dbfa04beeb07566c4b855a6d7&client_secret=4899932f3ea348fc9f6569a08aaba305',
      // client_id: '9669a28dbfa04beeb07566c4b855a6d7',
      // client_secret: '4899932f3ea348fc9f6569a08aaba305',
    })
      .then(response => response.json())
      .then(json => {
        console.log('data is > ', json);
        setSpotifyToken(json?.access_token);
        playlistAPI(json?.access_token);
        return json;
      })
      .catch(error => {
        console.error(error);
      });
  };
  const fetchPlaylistTracks = id => {
    fetch('https://api.spotify.com/v1/playlists/' + id, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Bearer ' + spotifyToken,
      },
      // body: {
      //   grant_type: 'client_credentials',
      //   client_id: '9669a28dbfa04beeb07566c4b855a6d7',
      //   client_secret: '4899932f3ea348fc9f6569a08aaba305',
      // },
    })
      .then(response => response.json())
      .then(json => {
        console.log('playlist is is > ', JSON.stringify(json));
        // if (json.hasOwnProperty('error')) {
        //   getToken();
        //   return;
        // }
        setPlayListTracksData(json.tracks.items);
        return JSON.stringify(json);
      })
      .catch(error => {
        console.log(error);
      });
  };
  const playlistAPI = token => {
    console.log('going to call APi');
    if (playListData?.length > 0) return;
    fetch('https://api.spotify.com/v1/browse/featured-playlists?country=US', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Bearer ' + token,
      },
      // body: {
      //   grant_type: 'client_credentials',
      //   client_id: '9669a28dbfa04beeb07566c4b855a6d7',
      //   client_secret: '4899932f3ea348fc9f6569a08aaba305',
      // },
    })
      .then(response => response.json())
      .then(json => {
        console.log('data is > ', JSON.stringify(json));
        if (json.hasOwnProperty('error')) {
          getToken();
          return;
        }
        setPlayListData(json.playlists.items);
        return JSON.stringify(json);
      })
      .catch(error => {
        console.log(error);
      });
  };
  const renderFlatlistView = ({item, index}) => {
    return (
      <>
        <TouchableOpacity
          style={{
            flexDirection: 'column',
          }}
          onPress={() => {
            fetchPlaylistTracks(item.id);
            setModalVisible(true);
          }}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              style={{width: 70, height: 70, marginRight: 10, flex: 20}}
              source={{uri: item.images[0].url}}
            />
            <Text style={{fontSize: 15, flex: 60}}>{item?.name}</Text>
            <Text style={{fontSize: 15, flex: 20}}>{item.tracks.total}</Text>
          </View>
          <View
            style={{
              backgroundColor: 'grey',
              height: 1,
              marginTop: 5,
              marginBottom: 5,
            }}
          />
        </TouchableOpacity>
      </>
    );
  };
  const renderPlaylistItemsView = ({item, index}) => {
    return (
      <>
        <TouchableOpacity
          style={{
            flexDirection: 'column',
            width: Dimensions.get('window').width,
            // height: Dimensions.get('window').height,
          }}
          onPress={() => {
            // fetchPlaylistTracks(item.id);
            setSelectedTrack(item);
            // setModalVisible(false);
            setModalTrackVisible(true);
          }}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              style={{width: 70, height: 70, marginRight: 10, flex: 20}}
              source={{uri: item?.track?.album?.images[0]?.url}}
            />
            <View style={{flex: 50, flexDirection: 'column'}}>
              <Text style={{fontSize: 15}}>{item?.track?.name}</Text>
              <Text style={{fontSize: 15}}>
                {'By:  ' + item?.track?.artists[0]?.name}
              </Text>
            </View>
            <Text style={{fontSize: 15, flex: 30}}>
              {'Popularity: ' + item?.track?.popularity}
            </Text>
          </View>
          <View
            style={{
              backgroundColor: 'grey',
              height: 1,
              marginTop: 5,
              marginBottom: 5,
            }}
          />
        </TouchableOpacity>
      </>
    );
  };

  // const apiToken = getToken();
  const data = playlistAPI(spotifyToken);
  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <FlatList data={playListData} renderItem={renderFlatlistView} />
      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {!modalTrackVisible && (
              <>
                <FlatList
                  data={playListTracksData}
                  horizontal={false}
                  showsHorizontalScrollIndicator={false}
                  renderItem={renderPlaylistItemsView}
                  alwaysBounceHorizontal={false}
                />
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => {
                    setModalVisible(!modalVisible);
                    setPlayListTracksData({});
                  }}>
                  <Text style={styles.textStyle}>Back</Text>
                </Pressable>
              </>
            )}
            {modalTrackVisible && (
              <>
                <View style={{padding: 20}}>
                  <Image
                    style={{
                      width: Dimensions.get('window').width,
                      // height: 570,
                      marginRight: 10,
                      flex: 40,
                    }}
                    source={{uri: selectedTrack?.track?.album?.images[0]?.url}}
                  />
                  <View style={{flexDirection: 'column', flex: 10, margin: 20}}>
                    <Text style={{fontSize: 15}}>
                      {'Title: ' + selectedTrack?.track?.name}
                    </Text>
                    <Text style={{fontSize: 15}}>
                      {'By:  ' + selectedTrack?.track?.artists[0]?.name}
                    </Text>
                    <Text style={{fontSize: 15, marginBottom: 10}}>
                      {'Duration: ' +
                        new Date(
                          selectedTrack?.track?.duration_ms,
                        ).getMinutes() +
                        ':' +
                        new Date(
                          selectedTrack?.track?.duration_ms,
                        ).getSeconds()}
                    </Text>
                    <Pressable
                      style={[styles.button, styles.buttonClose]}
                      onPress={() => {
                        setModalTrackVisible(!modalTrackVisible);
                        // setPlayListTracksData({});
                      }}>
                      <Text style={styles.textStyle}>Close</Text>
                    </Pressable>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
      {/* <Modal
        animationType="fade"
        transparent={true}
        visible={modalTrackVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Image
              style={{width: 70, height: 70, marginRight: 10, flex: 20}}
              source={{uri: selectedTrack?.track?.album?.images[0]?.url}}
            />
            <View style={{flex: 50, flexDirection: 'column'}}>
              <Text style={{fontSize: 15}}>{selectedTrack?.track?.name}</Text>
              <Text style={{fontSize: 15}}>
                {'By:  ' + selectedTrack?.track?.artists[0]?.name}
              </Text>
            </View>
            <Text style={{fontSize: 15, flex: 30}}>
              {'Popularity: ' + selectedTrack?.track?.popularity}
            </Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                setModalTrackVisible(!modalTrackVisible);
              }}>
              <Text style={styles.textStyle}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // paddingTop: 32,
  },
  modalView: {
    // margin: 20,
    backgroundColor: 'white',
    // borderRadius: 20,
    padding: 5,
    alignItems: 'center',
    shadowColor: '#000',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  touchView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
