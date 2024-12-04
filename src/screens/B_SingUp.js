import { Button, View } from "react-native";

function HomeScreen({navigation}){
    return(
        <View style={{flex: 1, alignItems: 'center',justifyContent: 'center'}}>
            <Button
            onPress={()=>navigation.navigate('Login')}
            title="Ya tengo una cuenta"
            />
            <Button
            onPress={()=>navigation.navigate('Events')}
            title="Registrarse"
            />
        </View>
    );
}
export default HomeScreen;