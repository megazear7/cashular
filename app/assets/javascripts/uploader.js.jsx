class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = { columns: [
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
            self.setState({uploadData: $.csv.toObjects(event.target.result)});
        };

        reader.onerror = function() {
            alert('Unable to read ' + file.fileName);
        };
    }

    finishUpload() {
        var data = { };
        
        data.transactions = this.state.uploadData.map(function(transaction) {
            return {
                description: transaction.description,
                post_date: transaction.date,
                amount: transaction.amount
            };
        });

        $.post("/transactions/upload", data);
    }

    render() {
        var self = this;
        return (
            <Grid>
                <Cell desktop={12} className="centered">
                    <H5>Upload Transactions</H5>
                    <p>The file must be a csv with three column headers: description, date, and amount.</p>
                </Cell>
                <Cell desktop={12} className="centered">
                    <FileUploader action={self.uploadTransactions} />
                </Cell>
                {typeof self.state.uploadData !== "undefined" &&
                    <Cell desktop={12} className="centered">
                        <Button action={self.finishUpload} className="mdl-button--raised">Upload</Button>
                    </Cell>}
                {typeof self.state.uploadData !== "undefined" &&
                    <Cell desktop={12}>
                        <Table rows={self.state.uploadData} className="center" columns={this.state.columns} />
                    </Cell>}
            </Grid>
        );
    }
}

