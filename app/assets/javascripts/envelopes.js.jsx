class Envelopes extends React.Component {
    constructor(props) {
        super(props);

        this.load = this.load.bind(this);

        this.state = { };
        this.state.envelopes = [ ];

        this.state.type = "previous_week";

        this.load();
    }

    load() {
        var self = this;

        var envelopes = Cashular.Envelopes()
            
        if (self.state.type === "previous_week") {
            envelopes.daysAgo(7);
        } else if (self.state.type === "previous_month") {
            envelopes.daysAgo(30);
        } else if (self.state.type === "previous_year") {
            envelopes.daysAgo(365);
        }
            
        envelopes.all(function(envelopes) {
            self.setState({envelopes: envelopes}, function() {
                self.props.newEnvelope();
            });
        });
    }

    types() {
        return [{title: "Previous Week", key: "previous_week"},
                {title: "Previous Month", key: "previous_month"},
                {title: "Previous Year", key: "previous_year"},
                {title: "All Time", key: "all_time"}];
    }

    changeType(type) {
        var self = this;
        return function() {
            self.setState({type: type}, function() {
                self.load();
            });
        };
    }

    render() {
        var self = this;
        return (
            <Grid>
                <Cell desktop={3}>
                    <List>
                        {self.types().map(function(type, index) {
                            return <ListItem key={type.key} name={type.key} onChange={self.changeType(type.key)}
                                             checked={self.state.type === type.key} title={type.title} icon="restore" />
                        })}
                    </List>
                </Cell>
                <Cell desktop={9}>
                    <Grid>
                        {self.state.envelopes.map(function(envelope, index) {
                            return <Envelope amount={envelope.sum} title={envelope.title}
                                           key={index} onRemove={self.load} id={envelope.id} /> })}
                        <NewEnvelope onCreate={self.load} />
                    </Grid>
                </Cell>
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
