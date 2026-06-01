package com.nexus.study.services;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class AiService {

    // Simple keyword-driven prompt matching simulating a medical study LLM
    public Map<String, Object> resolveMedicalPrompt(String prompt) {
        String query = prompt.toLowerCase();
        Map<String, Object> result = new HashMap<>();
        List<Map<String, String>> flashcards = new ArrayList<>();
        String replyText;

        if (query.contains("flashcard")) {
            if (query.contains("heart") || query.contains("cardio") || query.contains("anatomy")) {
                replyText = "🩺 **Jaypee Study AI**: I have generated 3 cardiac anatomy flashcards for your revision deck!";
                flashcards.add(Map.of(
                    "front", "What are the four chambers of the human heart?",
                    "back", "Right atrium, right ventricle, left atrium, and left ventricle."
                ));
                flashcards.add(Map.of(
                    "front", "Which blood vessel carries oxygenated blood from the lungs to the heart?",
                    "back", "The pulmonary vein."
                ));
                flashcards.add(Map.of(
                    "front", "What is the primary pacemaker of the heart?",
                    "back", "The Sinoatrial (SA) Node."
                ));
            } else if (query.contains("bone") || query.contains("skeleton") || query.contains("skeletal")) {
                replyText = "🩺 **Jaypee Study AI**: I have generated 3 osteology (skeletal system) flashcards for your deck!";
                flashcards.add(Map.of(
                    "front", "What is the longest and strongest bone in the human body?",
                    "back", "The femur (thigh bone)."
                ));
                flashcards.add(Map.of(
                    "front", "How many bones are in the adult human skeleton?",
                    "back", "206 bones."
                ));
                flashcards.add(Map.of(
                    "front", "Which bones protect the heart and lungs?",
                    "back", "The ribs and sternum (thoracic cage)."
                ));
            } else {
                replyText = "🩺 **Jaypee Study AI**: Here are 3 general medical physiology flashcards for your deck!";
                flashcards.add(Map.of(
                    "front", "What is the normal resting heart rate range for adults?",
                    "back", "60 to 100 beats per minute (bpm)."
                ));
                flashcards.add(Map.of(
                    "front", "Which organ produces insulin to regulate blood sugar?",
                    "back", "The pancreas."
                ));
                flashcards.add(Map.of(
                    "front", "What is the main functional unit of the human kidney?",
                    "back", "The nephron."
                ));
            }
        } 
        else if (query.contains("heart") || query.contains("cardio")) {
            replyText = "❤️ **Cardiovascular System Summary:**\n" +
                    "The human cardiovascular system consists of the heart and blood vessels. " +
                    "The heart acts as a double pump: the right side pumps deoxygenated blood to the lungs (pulmonary circulation), " +
                    "and the left side pumps oxygenated blood to the body (systemic circulation).\n" +
                    "💡 *Study Tip: You can type 'generate anatomy flashcards about the heart' to add cards to your revision deck!*";
        } 
        else if (query.contains("brain") || query.contains("neuron") || query.contains("nervous")) {
            replyText = "🧠 **Nervous System Overview:**\n" +
                    "The nervous system is split into the Central Nervous System (CNS - brain and spinal cord) " +
                    "and the Peripheral Nervous System (PNS). Neurons transmit electrical impulses. " +
                    "Synapses are junctions where neurotransmitters (like acetylcholine or dopamine) carry signals between cells.";
        }
        else if (query.contains("kidney") || query.contains("renal")) {
            replyText = "🧼 **Renal Physiology Summary:**\n" +
                    "The kidneys filter blood to remove metabolic waste, maintain electrolyte balance, and regulate blood pressure (via the renin-angiotensin-aldosterone system). " +
                    "Filtration occurs in the glomerulus, followed by selective reabsorption in the tubules.";
        }
        else {
            replyText = "👋 Hello! I am the **Jaypee Medical Study AI** assistant.\n" +
                    "I can help you review concepts in anatomy, physiology, and pharmacology. Try asking:\n" +
                    "• *'Explain the anatomy of the heart'*\n" +
                    "• *'What is the function of a neuron?'*\n" +
                    "• *'Generate flashcards about skeletal bones'*";
        }

        result.put("reply", replyText);
        result.put("flashcards", flashcards);
        return result;
    }
}
