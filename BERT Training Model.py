from datasets import load_dataset
dataset = load_dataset('imdb')
print(dataset)
small_train_dataset = dataset["train"].shuffle(seed=42).select([i for i in list(range(3000))])
small_test_dataset = dataset["test"].shuffle(seed=42).select([i for i in list(range(300))])


from transformers import AutoTokenizer
tokenizer = AutoTokenizer.from_pretrained('distilbert-base-uncased')

def preprocess_function(examples):
    return tokenizer(examples['text'], truncation=True, padding=True, max_length=512)

tokenized_train = small_train_dataset.map(preprocess_function, batched=True)
tokenized_test = small_test_dataset.map(preprocess_function, batched=True)

from transformers import DataCollatorWithPadding
data_collator = DataCollatorWithPadding(tokenizer=tokenizer)

from transformers import AutoModelForSequenceClassification
model = AutoModelForSequenceClassification.from_pretrained("distilbert-base-uncased", num_labels=2)

import numpy as np
import evaluate
 
def compute_metrics(eval_pred):
   load_accuracy = evaluate.load("accuracy")
   load_f1 = evaluate.load("f1")
  
   logits, labels = eval_pred
   predictions = np.argmax(logits, axis=-1)
   accuracy = load_accuracy.compute(predictions=predictions, references=labels)["accuracy"]
   f1 = load_f1.compute(predictions=predictions, references=labels)["f1"]
   return {"accuracy": accuracy, "f1": f1}

from huggingface_hub import notebook_login
notebook_login("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")


from transformers import TrainingArguments, Trainer
repo_name = "lOBANG-FOREVER"

training_args = TrainingArguments(
   output_dir=repo_name,
   learning_rate=2e-5,
   per_device_train_batch_size=16,
   per_device_eval_batch_size=16,
   num_train_epochs=2,
   weight_decay=0.01,
   save_strategy="epoch",
   push_to_hub=True,
)
 
trainer = Trainer(
   model=model,
   args=training_args,
   train_dataset=tokenized_train,
   eval_dataset=tokenized_test,
   tokenizer=tokenizer,
   data_collator=data_collator,
   compute_metrics=compute_metrics,
)

trainer.train()
trainer.evaluate()
trainer.push_to_hub(commit_message="Training complete")

from datasets import load_dataset

model1 = load_dataset("Lyreck/tiktok_brat_comments")

from transformers import pipeline
 
sentiment_model = pipeline(model1)
sentiment_model(["this fucking ate", "she's julia", "i love you", "i hate you" ])

