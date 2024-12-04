import { Button, View } from "react-native";

function HomeScreen({navigation}){
    return(
        <View style={{flex: 1, alignItems: 'center',justifyContent: 'center'}}>
            <Button
            onPress={()=>navigation.navigate('Memories')}
            title="Guardar"
            />
            <Button
            onPress={()=>navigation.navigate('Memories')}
            title="X"
            />
        </View>
    );
}
export default HomeScreen;