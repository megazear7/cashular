class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                { title: "Description", name: "description" },
                { title: "Date", name: "date", numeric: true },
                { title: "Amount", name: "amount", numeric: true }]};

        this.uploadTransactions = this.uploadTransactions.bind(this);
        this.finishUpload = this.finishUpload.bind(this);
    }

    uploadTransactions(file) {
        var self = this;

        var reader = new FileReader();
        reader.readAsText(file);

        reader.onload = function(event){
            var uploadRows = $.csv.toObjects(event.target.result);
            var uploadRowsFormatted = [ ];

            $.each(uploadRows, function(index, row) {
                // This ensures the date is in the correct format
                var date = moment(row.date, "MM/DD/YYYY")
                uploadRowsFormatted.push({
                    amount: row.amount,
                    date: date.format("MMMM Do, YYYY"),
                    description: row.description
                });
            });

            self.setState({uploadData: uploadRows, uploadDataFormatted: uploadRowsFormatted});
        };

        reader.onerror = function() {
            alert('Unable to read ' + file.fileName);
        };
    }

    finishUpload() {
        var self = this;
        var data = { };
        
        data.transactions = self.state.uploadData.map(function(transaction) {
            return {
                description: transaction.description,
                post_date: transaction.date,
                amount: transaction.amount
            };
        });

        $.post("/transactions/upload", data)
        .success(function() {
            self.props.addedTransactions();
            self.setState({uploadData: [ ]});
        });
    }

    render() {
        var self = this;
        return (
            <Grid>
                <Cell desktop={12} tablet={8} phone={4} className="centered">
                    <H5>Upload Transactions</H5>
                    <p>The file must be a csv with three column headers: description, date, and amount. The dates need to be in the format MM/DD/YYYY</p>
                </Cell>
                <Cell desktop={12} tablet={8} phone={4} className="centered">
                    <FileUploader action={self.uploadTransactions} />
                </Cell>
                {typeof self.state.uploadData !== "undefined" && self.state.uploadData.length > 0 &&
                    <Cell desktop={12} tablet={8} phone={4} className="centered">
                        <Button action={self.finishUpload} className="mdl-button--raised">Upload</Button>
                    </Cell>}
                {typeof self.state.uploadData !== "undefined" && self.state.uploadData.length > 0 &&
                    <Cell desktop={12} tablet={8} phone={4}>
                        <Table rows={self.state.uploadDataFormatted} className="center" columns={this.state.columns} />
                    </Cell>}
            </Grid>
        );
    }
}

