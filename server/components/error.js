const handleError = (err, res) => {
    console.log(err)
    res
        .status(500)
        .contentType('text/plain')
        .end('Oops! Something went wrong!');
};

module.exports = {handleError};