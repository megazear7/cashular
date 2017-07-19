class Envelope extends React.Component {
    constructor(props) {
        super(props);

        this.remove = this.remove.bind(this);
    }

    remove() {
        var self = this;
        Cashular.Envelopes().destroy(this.props.id, function(destroyedItem) {
            self.props.onRemove();
        });
    }

    render() {
        var color;

        if (this.props.amount < 0) {
            color = "orange";
        } else {
            color = "green";
        }

        return (
            <Cell desktop="3" tablet="4" phone="4">
                <Card className={"min-card " + color}>
                    {! this.props.dontShowAmount &&
                        <CardTitle>
                            {Math.abs(this.props.amount)}
                        </CardTitle>}
                    <CardText>
                        {this.props.title}
                    </CardText>
                    <CardMenu>
                        <LesserIcon icon="delete" action={this.remove} />
                    </CardMenu>
                </Card>
            </Cell>
        )
    }
}
