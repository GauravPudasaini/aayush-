import { useState } from 'react';
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import axios from "axios";

const languages = [
  { value: 'en', label: 'English' },
  { value: 'zh', label: 'Chinese' },
];

const Translator = () => {
  const [text, setText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [fromLanguage, setFromLanguage] = useState('en');
  const [toLanguage, setToLanguage] = useState('zh');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const handleTranslate = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post("http://127.0.0.1:8000/translate/", {
        text: text,
        src_lang: fromLanguage,
        tgt_lang: toLanguage,
        a: 32,
        b: 3,
        max_input_length: 1024,
        num_beams: 4
      });

      if (response.data && Array.isArray(response.data.translated_text)) {
        setTranslatedText(response.data.translated_text[0]);
      } else {
        setError("Translation response is invalid.");
      }
    } catch (error) {
      setError("Error translating text. Please try again.");
      console.error("Error translating text:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-lg font-bold mb-4">Translator</h2>
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col space-y-2">
          <Label htmlFor="text">Text to translate</Label>
          <Input id="text" value={text} onChange={handleTextChange} />
        </div>
        <div className="flex flex-col space-y-2">
          <Label htmlFor="from-language">From language</Label>
          <Select id="from-language" onValueChange={(value) => setFromLanguage(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="From language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((language) => (
                <SelectItem key={language.value} value={language.value}>
                  {language.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col space-y-2">
          <Label htmlFor="to-language">To language</Label>
          <Select id="to-language" onValueChange={(value) => setToLanguage(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="To language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((language) => (
                <SelectItem key={language.value} value={language.value}>
                  {language.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleTranslate} disabled={loading}>
          {loading ? 'Translating...' : 'Translate'}
        </Button>
        {error && <div className="text-red-500 mt-2">{error}</div>}
        <div className="flex flex-col space-y-2">
          <Label htmlFor="translated-text">Translated text</Label>
          <Input id="translated-text" value={translatedText} readOnly />
        </div>
      </div>
    </div>
  );
};

export default Translator;
