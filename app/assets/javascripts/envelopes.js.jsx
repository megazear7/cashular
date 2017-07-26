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

        var grossSpending = Math.abs(self.props.envelopes.reduce(function(gross, envelope) {
            return envelope.sum < 0 ? gross + parseFloat(envelope.sum) : gross;
        }, 0));

        var grossReceived = Math.abs(self.props.envelopes.reduce(function(gross, envelope) {
            return envelope.sum > 0 ? gross + parseFloat(envelope.sum) : gross;
        }, 0));

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
                    if (envelope.sum !== 0) {
                        return <Envelope amount={self.perTimePeriod(envelope.sum)}
                                         title={envelope.title}
                                         key={index}
                                         onRemove={self.load}
                                         id={envelope.id} /> }})}
                <NewEnvelope onCreate={self.load} />
                <Cell desktop={12} tablet={8} phone={4}>
                    <hr />
                </Cell>
                <Cell desktop={10} tablet={6} phone={0}>
                    <H6>Empty Envelopes</H6>
                    <Grid>
                        {self.props.envelopes.map(function(envelope, index) {
                            if (envelope.sum === 0) {
                                return <Envelope amount={envelope.sum}
                                                 title={envelope.title}
                                                 dontShowAmount={true}
                                                 key={index}
                                                 onRemove={self.load}
                                                 id={envelope.id}
                                                 size={4} /> }})}
                    </Grid>
                </Cell>
                <Cell desktop={2} tablet={2} phone={4}>
                    {(grossSpending > 0 || grossReceived > 0) &&
                        <Grid>
                            <Cell desktop={12} tablet={8} phone={4}>
                                <H6>Total</H6>
                                {grossSpending > 0 &&
                                    <p>Spent: ${Cashular.Utils.format(grossSpending)}</p>}
                                {grossReceived > 0 &&
                                    <p>Recieved: ${Cashular.Utils.format(grossReceived)}</p>}
                            </Cell>
                        </Grid>}
                    {typeof self.state.unallocated !== "undefined" && (self.state.unallocated.payments > 0 || self.state.unallocated.recieved > 0) &&
                        <Grid>
                            <Cell desktop={12} tablet={8} phone={4}>
                                <H6>Unallocated</H6>
                                {self.state.unallocated.payments > 0 &&
                                    <p>Payments: ${Cashular.Utils.format(self.state.unallocated.payments)}</p>}
                                {self.state.unallocated.recieved > 0 &&
                                    <p>Recieved: ${Cashular.Utils.format(self.state.unallocated.recieved)}</p>}
                            </Cell>
                        </Grid>}
                </Cell>
            </Grid>
        );
    }
}
