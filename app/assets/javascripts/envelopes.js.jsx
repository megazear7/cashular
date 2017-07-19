class Buckets extends React.Component {
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
            self.setState({envelopes: envelopes});
        });
    }

    render() {
        return (
            <Grid>
                {this.state.envelopes.map(function(envelope, index) {
                    return <Bucket amount={envelope.total} title={envelope.title} key={index} /> })}
                <NewBucket onCreate={this.load} />
            </Grid>
        );
    }
}

class Bucket extends React.Component {
    render() {
        return (
            <Cell desktop="3" tablet="4" phone="4">
                <Card className="min-card orange">
                    <CardTitle>
                        {this.props.amount}
                    </CardTitle>
                    <CardText>
                        {this.props.title}
                    </CardText>
                </Card>
            </Cell>
        )
    }
}

class NewBucket extends React.Component {
    constructor(props) {
        super(props);

        this.createBucket = this.createBucket.bind(this);
    }

    createBucket(title) {
        var self = this;
        Cashular.Envelopes().create({title: title}, function() {
            self.props.onCreate();
        });
    }

    render() {
        return (
            <Cell desktop="3" tablet="4" phone="4">
                <TextField placeholder="Title of new Envelope" onSubmit={this.createBucket} name="newbucket" />
            </Cell>
        )
    }
}

class Envelopes extends React.Component {
    render() {
        return (
            <Grid>
                <Cell desktop="3" tablet="4" phone="4">
                    <Card>
                        <CardTitle>
                            Hello
                        </CardTitle>
                        <CardText>
                            Envelopes
                        </CardText>
                    </Card>
                </Cell>
            </Grid>
        );
    }
}
