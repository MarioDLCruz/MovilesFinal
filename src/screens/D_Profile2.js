import { Button, View } from "react-native";

function HomeScreen({navigation}){
    return(
        <View style={{flex: 1, alignItems: 'center',justifyContent: 'center'}}>
            <Button
            onPress={()=>navigation.navigate('Profile')}
            title="Guardar cambios"
            />
            <Button
            onPress={()=>navigation.navigate('Profile')}
            title="Cancelar"
            />
        </View>
    );
}
export default HomeScreen;