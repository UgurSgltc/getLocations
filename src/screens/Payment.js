import React from 'react'
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Pressable,
    Dimensions,
    UIManager,
    Image,
    
} from 'react-native'
import { formatDistance } from '../helperFunctions'
import { Modalize } from 'react-native-modalize';
import { TextInput } from 'react-native-gesture-handler';
import { CreditCardInput, LiteCreditCardInput } from "react-native-credit-card-input";
UIManager.setLayoutAnimationEnabledExperimental(true);
export default class Payment extends React.Component {
    constructor(props) {
        super(props);
        const Tax = 18;
        this.state = {
            taxRatio: Tax / 100,
            Tax: Tax
        }
        this.ref = React.createRef();
    }
    
    calcTax = (subTotal) => {
        const { taxRatio } = this.state;
        return this.getFixedPrice(subTotal * taxRatio)
    }

    getTotalprice = (subTotal) => {
        return this.getFixedPrice(parseFloat(this.calcTax(subTotal)) + parseFloat(subTotal))
    }
    getFixedPrice(price) {
        return parseFloat(price).toFixed(2)
    }
    closeCheckout = () => {
        this.ref.current.close()
    }
    render() {
        const { travelDistance } = this.props.route.params || {}
        const SubTotal = formatDistance(travelDistance);
        const { Tax } = this.state;
        return <View style={{}}>
            <View style={{ flexDirection: 'row', display:"flex",justifyContent:'space-between', alignItems:'center', marginTop: 20, marginBottom: 20,
            paddingVertical: 10, paddingHorizontal: 20,
            borderBottomColor: 'black', borderBottomWidth: 0.5, }}>
                <Text style={{  fontWeight: '900', color: '#000', fontSize: 22 }}>Details</Text>
                <Image
                    style={{
                        width: 30,
                        height: 30,
                        
                    }}
                    source={require('../assets/profile.png')} 
                    />
            </View>
            <View>
                <Text style={{ margin: 10, fontWeight: '600', color: '#000', fontSize: 17 }}>Your Cart </Text>

            </View>
            <View style={{ flexDirection: 'row', margin: 20, borderBottomColor: 'black', borderWidth: 0.5, height: 100, borderRadius: 10, shadowOffset: 100 }}>
                <View style={{ flexDirection: 'column' }}>
                    <Text style={{ left: 10, fontWeight: '400', color: '#000', fontSize: 14, marginTop: 8 }}>Your Drive</Text>
                    <Text style={{ left: 10 }}>{SubTotal}*1$</Text>
                </View>
                <View style={{ flexDirection: 'column', left: 200, margin: 22 }}>
                    <Text>{SubTotal}$</Text>

                </View>
            </View>
            <View style={{ borderBottomColor: 'gray', borderBottomWidth: 0.5, }}>
                <View style={{ flexDirection: 'row', display:'flex', justifyContent:'space-between', paddingVertical: 10, paddingHorizontal:20 }}>
                    <Text style={{ fontWeight: '400', color: '#000', fontSize: 14, }}> Sub Total</Text>
                    <Text>${SubTotal}</Text>
                </View>
                <View style={{ flexDirection: 'row', display:'flex', justifyContent:'space-between', paddingVertical: 10, paddingHorizontal:20 }}>
                    <Text style={{  fontWeight: '400', color: '#000', fontSize: 14}}>SalesTax({Tax}%)</Text>
                    <Text >${this.calcTax(SubTotal)}</Text>
                </View>
            </View>
            <View style={{ flexDirection: 'row', display:'flex', justifyContent:'space-between', paddingVertical: 10, paddingHorizontal:20}}>
                <Text style={{ fontWeight: '400', color: '#000', fontSize: 14}}> Total</Text>
                <Text>${this.getTotalprice(SubTotal)}</Text>
            </View>


            <TouchableOpacity
                onPress={() =>
                    this.ref.current.open()
                }

                style={{
                    backgroundColor: '#16AAE8',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 200,
                    height: 40,
                    borderBottomWidth: 5,
                    borderRadius: 3,
                    marginLeft: 100,
                    marginTop: 70,
                }}>
                <View>
                    <Text style={{ color: '#fff' }} >CheckOut</Text>
                </View>
            </TouchableOpacity>
            <Modalize
                modalHeight={400}
                withReactModal
                panGestureEnabled={false}
                tapGestureEnabled={false}
                closeOnOverlayTap={false}
                panGestureComponentEnabled={false}
                ref={this.ref}>
                <CheckOut
                    onClose={this.closeCheckout.bind(this)}
                    totalPrice={this.getTotalprice(SubTotal)}
                />

            </Modalize>
        </View>
    }
}

class CheckOut extends React.Component {
    _onChange = (e) => {
        console.log(e.values.number)
    }
    render() {
        return (
            <View>

                <View style={{flexDirection: 'row', marginTop: 10, marginBottom: 20, }}>
                    <Text style={{ marginLeft:10, fontWeight: '700', color: '#000', fontSize: 20 }}>Pay ${this.props.totalPrice} using</Text>

                </View>
                <View style={{}}>
                    <Text style={{marginLeft:10, fontWeight: '400', color: '#000', fontSize: 17 }}>Card İnformation </Text>
                </View>
                <CreditCardInput onChange={this._onChange}    cardScale={0.7} />
              


              
                <TouchableOpacity
                    onPress={() => this.props.onClose()
                    }

                    style={{
                        backgroundColor: '#16AAE8',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: 200,
                        height: 40,
                        borderBottomWidth: 5,
                        borderRadius: 3,
                        marginLeft: 100,
                        marginBottom:10,
                        marginTop:30,
                        
                    }}>
                    <View>
                        <Text style={{ color: '#fff' }} >Pay</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}