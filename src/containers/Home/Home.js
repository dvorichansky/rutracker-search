import React from 'react';
import Title from "../../components/Title/Title";

class Home extends React.Component {
    render() {
        return (
            <div className={"m-auto"}>
                <Title value={"Главная"}/>
            </div>
        )
    }
}

export default Home;