class Envelopes extends React.Component {
    constructor(props) {
        super(props);

        this.perTimePeriod = this.perTimePeriod.bind(this);
        this.setTimePeriod = this.setTimePeriod.bind(this);

        this.state = { unique: Cashular.Utils.makeid() };
    }

    perTimePeriod(amount) {
        if (typeof this.props.dateRange !== "undefined" &&
                typeof this.state.timePeriod !== "undefined" &&
                this.props.dateRange[this.state.timePeriod]) {
            return amount / this.props.dateRange[this.state.timePeriod];
        } else {
            return amount;
        }
    }

    setTimePeriod(timePeriod) {
        this.setState({timePeriod: timePeriod});
    }

    render() {
        var self = this;

        return (
            <Grid>
                <Cell desktop={10} tablet={7} phone={3} className="centered">
                    {typeof self.props.dateRange !== "undefined" && self.props.dateRange.title &&
                        <H6>{self.props.dateRange.title}</H6>}
                </Cell>
                <Cell desktop={2} tablet={1} phone={1}>
                    <PeriodSelector onChange={self.setTimePeriod} dateRange={self.props.dateRange} />
                </Cell>
                {self.props.envelopes.map(function(envelope, index) {
                    if (envelope.net != 0) {
                        return <Envelope amount={self.perTimePeriod(envelope.net)}
                                         title={envelope.title}
                                         key={index}
                                         onRemove={self.props.load}
                                         id={envelope.id} /> }})}
                <NewEnvelope onCreate={self.props.load} />
                <Cell desktop={12} tablet={8} phone={4}>
                    <hr />
                </Cell>
                <Cell desktop={10} tablet={6} phone={0}>
                    <H6>Empty Envelopes</H6>
                    <Grid>
                        {self.props.envelopes.map(function(envelope, index) {
                            if (envelope.net == 0) {
                                return <Envelope amount={envelope.net}
                                                 title={envelope.title}
                                                 dontShowAmount={true}
                                                 key={index}
                                                 onRemove={self.props.load}
                                                 id={envelope.id}
                                                 size={4} /> }})}
                    </Grid>
                </Cell>
                <Cell desktop={2} tablet={2} phone={4}>
                    {(self.props.gain > 0 || self.props.loss > 0 || self.props.unallocated > 0) &&
                        <Grid>
                            <Cell desktop={12} tablet={8} phone={4}>
                                {self.props.loss > 0 &&
                                    <p>Spent: ${Cashular.Utils.format(self.props.loss)}</p>}
                                {self.props.gain > 0 &&
                                    <p>Recieved: ${Cashular.Utils.format(self.props.gain)}</p>}
                                {self.props.unallocated > 0 &&
                                    <p>Unallocated: ${Cashular.Utils.format(self.props.unallocated)}</p>}
                            </Cell>
                        </Grid>}
                </Cell>
            </Grid>
        );
    }
}
