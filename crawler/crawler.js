// crawler/crawler.js - simple example crawler
import axios from "axios";
import * as cheerio from "cheerio";
import { Client } from "@elastic/elasticsearch";

const es = new Client({ node: process.env.ELASTIC_URL || "http://localhost:9200" });

async function crawl(url){
  try {
    const res = await axios.get(url);
    const $ = cheerio.load(res.data);
    const title = $("title").text();
    const snippet = $("meta[name='description']").attr("content") || $("p").first().text();

    await es.index({
      index: "documents",
      document: { title, snippet, url, type:"web", safe:true }
    });
    console.log("Indexed:", url);
  } catch(err){
    console.error("Failed:", url, err.message);
  }
}

const seeds = ["https://example.com","https://openai.com"];
seeds.forEach(u=>crawl(u));
