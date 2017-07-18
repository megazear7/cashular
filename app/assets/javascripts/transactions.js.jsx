class Transaction extends React.Component {
    render() {
        return (
            <Cell desktop="12">
                <Card className="transaction">
                    <CardTitle>
                        {"$" + this.props.cost}
                    </CardTitle>
                    <CardText>
                        {this.props.description}
                    </CardText>
                </Card>
            </Cell>
        );
    }
}

class Transactions extends React.Component {
    render() {
        return (
            <Grid className="transaction-list">
                <Transaction cost={15.45} description="Rosies Icecream" />
            </Grid>
        );
    }
}
