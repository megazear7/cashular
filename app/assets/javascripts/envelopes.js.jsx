class Envelopes extends React.Component {
    constructor(props) {
        super(props);

        this.load = this.load.bind(this);

        this.state = { };
        this.state.envelopes = [ ];

        this.load();
    }

    load() {
        var self = this;

        Cashular.Envelopes().all(function(envelopes) {
            self.setState({envelopes: envelopes}, function() {
                self.props.newEnvelope();
            });
        });
    }

    render() {
        var self = this;
        return (
            <Grid>
                {self.state.envelopes.map(function(envelope, index) {
                    return <Envelope amount={envelope.sum} title={envelope.title}
                                   key={index} onRemove={self.load} id={envelope.id} /> })}
                <NewEnvelope onCreate={self.load} />
            </Grid>
        );
    }
}

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
                    <CardTitle>
                        {Math.abs(this.props.amount)}
                    </CardTitle>
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

class NewEnvelope extends React.Component {
    constructor(props) {
        super(props);

        this.createEnvelope = this.createEnvelope.bind(this);
    }

    createEnvelope(title) {
        var self = this;
        Cashular.Envelopes().create({title: title}, function() {
            self.props.onCreate();
        });
    }

    render() {
        return (
            <Cell desktop="3" tablet="4" phone="4">
                <TextField placeholder="Title of new Envelope" onSubmit={this.createEnvelope} name="newEnvelope" />
            </Cell>
        )
    }
}
