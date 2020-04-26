import React from "react";
import {
    View,
    Text,
    StyleSheet
} from "react-native";

import { Container, Content, Icon } from 'native-base'
import CardComponent from '../CardComponent'

export default class ActivityFeed extends React.Component {

    render() {
        const img = [{ id: 1 },{ id: 2 },{ id: 3 }]
        return (
            <Container style={styles.container}>
                <Content>
                    {img.map((prop, key) => {
                        return ( 
                        <CardComponent imageSource={prop.id} likes="" key={key} navigate = {this.props.navigation}/> )
                    })}
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    }
});