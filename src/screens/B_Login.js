import { Button, View } from "react-native";

function HomeScreen({navigation}){
    return(
        <View style={{flex: 1, alignItems: 'center',justifyContent: 'center'}}>
            <Button
            onPress={()=>navigation.navigate('SingUp')}
            title="Registrarse"
            />
            <Button
            onPress={()=>navigation.navigate('Events')}
            title="Acceder"
            />
        </View>
    );
}
export default HomeScreen;