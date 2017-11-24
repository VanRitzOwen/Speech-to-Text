var express = require('express'),
    router = express.Router(),
    SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1'),
    fs = require('fs'),
    subtitle = require('subtitle'),
    speech = require('@google-cloud/speech'),
    Storage = require('@google-cloud/storage');

router.get("/ibm",function (req,res) {
    var qs = req.query;
    var credit = {
        "url": "https://stream.watsonplatform.net/speech-to-text/api",
        "username": "a6cf5b2f-7c26-453e-a1f8-c77a2414046b",
        "password": "qMGveYLJbId4"
    };

    var speech_to_text = new SpeechToTextV1 ({
        username: "a6cf5b2f-7c26-453e-a1f8-c77a2414046b",
        password: "qMGveYLJbId4",
        headers: {
            'X-Watson-Learning-Opt-Out': true
        }
    });
    // streaming传输
    // var params = {
    //     'model': global.MODEL.models.json[qs.lang].name,
    //     'content-type': 'audio/mp3',
    //     'interim_results': true,
    //     'max_alternatives': 3,
    //     'word_confidence': true,
    //     'timestamps': true
    // };
    // // Create the stream.
    // var recognizeStream = speech_to_text.createRecognizeStream(params);
    //
    // // Pipe in the audio.
    // fs.createReadStream(global.server + '/assets/audio/en.mp3').pipe(recognizeStream);
    //
    // // Pipe out the transcription to a file.
    // recognizeStream.pipe(fs.createWriteStream(global.server + '/assets/result/transcription.txt'));
    //
    // // Get strings instead of buffers from 'data' events.
    // recognizeStream.setEncoding('utf8');
    //
    // // Listen for events.
    // recognizeStream.on('results', function(event) { onEvent('Results:', event); });
    // recognizeStream.on('data', function(event) { onEvent('Data:', event); });
    // recognizeStream.on('error', function(event) { onEvent('Error:', event); });
    // recognizeStream.on('close', function(event) { onEvent('Close:', event); });
    // recognizeStream.on('speaker_labels', function(event) { onEvent('Speaker_Labels:', event); });
    //
    // // Displays events on the console.
    // function onEvent(name, event) {
    //     // if(name == 'Results:'){
    //     //     res.json({
    //     //         errno: 0,
    //     //         result: event
    //     //     })
    //     // }else{
    //     //     res.json({
    //     //         errno: 1,
    //     //         name: name,
    //     //         result: event
    //     //     })
    //     // }
    //     console.log(name,JSON.stringify(event,null,2));
    // };
    console.log(global.server + '/assets/audio/' + qs.file,qs.type);
    //file传输
    var params = {
        audio: fs.createReadStream(global.server + '/assets/audio/' + qs.file),
        content_type: 'audio/'+qs.type,
        timestamps: true,
        word_confidence: true,
        smart_formatting: true
    };
    speech_to_text.recognize(params, function(error, transcript) {
        if (error){
            console.log('Error:', error);
            res.json({
                errno: 1,
                result: error
            });
        }
        else{
            console.log(JSON.stringify(transcript, null, 2));
            // var subs = [];
            // var result = transcript.results;
            // for(var i = 0; i < result.length;i++){
            //     var timestamps = result[i].alternatives[0].timestamps;
            //     for(var k = 0; k < timestamps.length; k++){
            //         subs.push({
            //             start: timestamps[k][1]*1000,
            //             end: timestamps[k][2]*1000,
            //             text: timestamps[k][0]
            //         })
            //     }
            // }
            // var srt = subtitle.stringify(subs);
            fs.writeFile(global.server + "/assets/result/transcription.txt",JSON.stringify(transcript, null, 2));
            res.json({
                errno: 0,
                result: JSON.stringify(transcript, null, 2)
            })
        }
    });
});

router.get("/google", function (req,res) {
    var qs = req.query;
    var upload = false;
    var client = new speech.SpeechClient({
        projectId: "esoteric-code-185509",
        keyFilename: global.server + "/config/try-apis-6175396ff69e.json"
    });
    const storage = Storage({
        projectId: "esoteric-code-185509",
        keyFilename: global.server + "/config/try-apis-6175396ff69e.json"
    });
    if(qs.type.toLowerCase() == 'flac' || qs.type.toLowerCase() == 'mp3'){
        var encode = 'FLAC';
        var hertz = 48000;
    }else if(qs.type.toLowerCase() == 'wav'){
        var encode = 'LINEAR16';
        var hertz = 44100;
    }else if(qs.type.toLowerCase() == 'ogg'){
        var encode = 'OGG_OPUS';
        var hertz = 16000;
    }
    var fileName = global.server + '/assets/audio/' + qs.file;
    // var file = fs.readFileSync(fileName);
    // var audioBytes = file.toString('base64');
    const bucketName = 'transgod';
    storage
        .bucket(bucketName)
        .upload(fileName)
        .then(() => {
            console.log(`${fileName} uploaded to ${bucketName}.`);
            upload = true;
        }).catch(err => {
            console.error('ERROR:', err);
            res.send({
                errno:1,
                msg: 'upload failed'
            })
        });
    // var audio = {
    //     content: audioBytes
    // };
    if(upload){
        var config = {
            encoding: encode,
            sampleRateHertz: hertz,
            languageCode: qs.lang,
            enableWordTimeOffsets: true
        };
        var audio = {
            uri: `gs://${bucketName}/${qs.file}`
        };

        var request = {
            audio: audio,
            config: config
        };
        client
            .longRunningRecognize(request)
            .then(data => {
                const operation = data[0];
                // Get a Promise representation of the final result of the job
                return operation.promise();
            }).then(data => {
                const response = data[0];
                // const transcription = response.results
                // .map(result => result.alternatives[0].transcript)
                // .join('\n');
                // console.log(`Transcription: ${transcription}`);
                // fs.writeFile(global.server + "/assets/result/google_transcription.txt",transcription);
                // res.send({
                //     errno: 0,
                //     result: transcription
                // })
                response.results.forEach(result => {
                    console.log(`Transcription: ${result.alternatives[0].transcript}`);
                    result.alternatives[0].words.forEach(wordInfo => {
                        // NOTE: If you have a time offset exceeding 2^32 seconds, use the
                        // wordInfo.{x}Time.seconds.high to calculate seconds.
                        const startSecs =
                            `${wordInfo.startTime.seconds}` +
                            `.` +
                            wordInfo.startTime.nanos / 100000000;
                        const endSecs =
                            `${wordInfo.endTime.seconds}` +
                            `.` +
                            wordInfo.endTime.nanos / 100000000;
                        console.log(`Word: ${wordInfo.word}`);
                        console.log(`\t ${startSecs} secs - ${endSecs} secs`);
                    });
                });
                fs.writeFile(global.server + "/assets/result/transcriptionGoogle.txt",JSON.stringify(response.results, null, 2));
                res.send({
                    errno: 0,
                    result: response.results
                })
            }).catch(err => {
                console.error('ERROR:', err);
                res.send({
                    errno: 1,
                    msg: err
                })
            });
    }
});

router.get("/google-bucket", function (req,res) {
    const storage = Storage({
        projectId: "esoteric-code-185509",
        keyFilename: global.server + "/config/try-apis-6175396ff69e.json"
    });
    const bucketName = "transgod";
    storage.createBucket(bucketName)
        .then(() => {
            console.log(`Bucket ${bucketName} created.`);
            res.send({
                errno: 0
            })
        }).catch(err => {
            console.error('ERROR:', err);
            res.send({
                errno: 1
            })
        });
});

module.exports = router;