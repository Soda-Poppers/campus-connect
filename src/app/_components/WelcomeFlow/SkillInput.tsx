/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import { useState, useCallback } from "react";
import type { Skill } from "~/types/skills";

interface SkillInputProps {
  label: string;
  skills: Skill[];
  onChange: (newSkills: Skill[]) => void;
  placeholder?: string;
}

const isSkill = (obj: any): obj is Skill =>
  obj && typeof obj.skillName === "string";

const SkillInput: React.FC<SkillInputProps> = ({
  label,
  skills,
  onChange,
  placeholder = "Type a skill and press Enter",
}) => {
  const [input, setInput] = useState("");

  const addSkill = useCallback(
    (skillName: string) => {
      const trimmed = skillName.trim();
      if (!trimmed) return;
      if (
        skills.some((s) => s.skillName.toLowerCase() === trimmed.toLowerCase())
      )
        return;
      onChange([...skills, { skillName: trimmed }]);
    },
    [skills, onChange],
  );

  const removeSkill = useCallback(
    (skillName: string) => {
      onChange(skills.filter((s) => s.skillName !== skillName));
    },
    [skills, onChange],
  );

  const updateSkillType = useCallback(
    (skillName: string, type: string) => {
      onChange(
        skills.map((s) =>
          s.skillName === skillName ? { ...s, type: type || undefined } : s,
        ),
      );
    },
    [skills, onChange],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill(input);
      setInput("");
    } else if (e.key === "Backspace" && !input && skills.length) {
      removeSkill(skills[skills.length - 1]!.skillName);
    }
  };

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium">{label} (optional)</label>
      <div className="flex flex-wrap gap-2">
        {skills.filter(isSkill).map((s) => (
          <div
            key={s.skillName}
            className="relative flex items-center gap-2 rounded-full border px-3 py-1 text-sm"
          >
            <div className="flex flex-col">
              <div className="font-medium">{s.skillName}</div>
              {s.type && <div className="text-xs text-gray-500">{s.type}</div>}
            </div>
            <button
              type="button"
              onClick={() => removeSkill(s.skillName)}
              className="ml-1 flex h-4 w-4 items-center justify-center rounded-full hover:bg-gray-200"
              aria-label={`Remove ${s.skillName}`}
            >
              &times;
            </button>
            {/* <select
              value={s.type || ""}
              onChange={(e) => updateSkillType(s.skillName, e.target.value)}
              className="ml-2 rounded border px-1 text-xs"
            >
              <option value="">Type</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="primary">Primary</option>
            </select> */}
          </div>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="min-w-[140px] flex-1 rounded-xl border px-3 py-2 text-sm outline-none"
        />
      </div>
      <p className="text-xs text-gray-500">
        Press Enter to add a skill. You can optionally tag a “type” per skill.
      </p>
    </div>
  );
};

export default SkillInput;
