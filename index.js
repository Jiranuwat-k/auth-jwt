const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
dotenv.config();

const PORT = process.env.PORT || 5000;
const AuthRoute = require("./routes/Auth");
const postRoute = require("./routes/post");

const corsOptions = {
  exposedHeaders: ['auth-token','refresh-token'],
  origin: [
    'http://localhost:8080',
    'http://127.0.0.1:8080'
    
  ],
  credentials: true,
};
// Global DB
// mongoose.connect(
//   process.env.DB_CONNECTION,
//   {
//     useUnifiedTopology: true,
//     useNewUrlParser: true,
//   },
//   () => console.log("Connected to DB")
// );

// Local DB
mongoose.connect(
    process.env.LOCAL_DB,
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    },
    () => console.log("Connected to DB")
  );

app.use(express.json());
app.use(cors(corsOptions));
app.use("/api/user", AuthRoute);
app.use("/api/posts", postRoute);

app.get("/",(req,res)=>{
  res.json(
  {
    "error":" false",
    "payload":{
      "data":"hello",
      "msg":"helloword",
    },
      "numFound": 5445,
      "start": 0,
      "maxScore": 6.545591,
      "docs": [
        {
          "id": "10.1371/journal.pone.0000290",
          "journal": "PLoS ONE",
          "eissn": "1932-6203",
          "publication_date": "2007-03-14T00:00:00Z",
          "article_type": "Research Article",
          "author_display": [
            "Rayna I. Kraeva",
            "Dragomir B. Krastev",
            "Assen Roguev",
            "Anna Ivanova",
            "Marina N. Nedelcheva-Veleva",
            "Stoyno S. Stoynov"
          ],
          "abstract": [
            "Nucleic acids, due to their structural and chemical properties, can form double-stranded secondary structures that assist the transfer of genetic information and can modulate gene expression. However, the nucleotide sequence alone is insufficient in explaining phenomena like intron-exon recognition during RNA processing. This raises the question whether nucleic acids are endowed with other attributes that can contribute to their biological functions. In this work, we present a calculation of thermodynamic stability of DNA/DNA and mRNA/DNA duplexes across the genomes of four species in the genus Saccharomyces by nearest-neighbor method. The results show that coding regions are more thermodynamically stable than introns, 3′-untranslated regions and intergenic sequences. Furthermore, open reading frames have more stable sense mRNA/DNA duplexes than the potential antisense duplexes, a property that can aid gene discovery. The lower stability of the DNA/DNA and mRNA/DNA duplexes of 3′-untranslated regions and the higher stability of genes correlates with increased mRNA level. These results suggest that the thermodynamic stability of DNA/DNA and mRNA/DNA duplexes affects mRNA transcription."
          ],
          "title_display": "Stability of mRNA/DNA and DNA/DNA Duplexes Affects mRNA Transcription",
          "score": 6.545591
        }]
}
)
})

app.listen(PORT, () => {
  console.log(`Running on port: ${PORT}`);
});
