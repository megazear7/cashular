console.log("app.js.jsx");

class App extends React.Component {
    render() {
        var cells = (
            <Cell desktop="3" tablet="4" phone="4">
                <Card>
                    <CardTitle>
                        Hello
                    </CardTitle>
                    <CardText>
                        This is cashular
                    </CardText>
                </Card>
            </Cell>
        );

        return(
            <Layout title="Cashular" cells={cells} />
        );
    }
}

$(document).ready(function() {
    ReactDOM.render(<App />, document.getElementById('react-root'));
});
