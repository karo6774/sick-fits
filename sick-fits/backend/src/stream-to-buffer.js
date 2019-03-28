const StreamSink = require("streamsink");

function streamToBuffer(stream) {
    const sink = new StreamSink();
    stream.pipe(sink);
    return new Promise((resolve, reject) => {
        stream.on("end", resolve);
        stream.on("error", reject);
    }).then(() => sink.toBuffer());
}

module.exports = streamToBuffer;
