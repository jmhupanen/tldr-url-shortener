## TLDR - the URL shortener  

This is a simple URL shortener that also has support for a secret list of keywords that can be defined in `CUSTOM_KEYWORDS` variable (format `{"<site>":"keywords":[<keywords>], ... , "normal", "keywords": [<keywords>]}`). For any YouTube keywords to work, the API key must be defined in environment variable called `YOUTUBE_API_KEY`.
