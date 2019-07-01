console.log('this is loaded');

SPOTIFY_ID = "9b9ca211d6254779bdf306d184656940";
SPOTIFY_SECRET = "94257ced851a495c98c66cd850918f51";

exports.spotify = {
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET
};