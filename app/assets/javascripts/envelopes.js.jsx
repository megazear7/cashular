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
        var self = this;
        return (
            <Grid>
                {self.state.envelopes.map(function(envelope, index) {
                    return <Bucket amount={envelope.total} title={envelope.title}
                                   key={index} onRemove={self.load} id={envelope.id} /> })}
                <NewBucket onCreate={self.load} />
            </Grid>
        );
    }
}

class Bucket extends React.Component {
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
        return (
            <Cell desktop="3" tablet="4" phone="4">
                <Card className="min-card orange">
                    <CardTitle>
                        {this.props.amount}
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
