export function getNextLesson(course, progressData) {
  console.log(progressData, course);
  if (!course || !progressData) return null;

  // Get last completed lesson record
  const lastProgress = progressData;
  const lastLessonId = lastProgress.id;
  const lastModuleId = lastProgress.module_id;

  // Find the module where the last lesson was completed
  const currentModule = course.modules.find((m) => m.id === lastModuleId);
  if (!currentModule) return null;

  // Sort lessons in the module by position (to be safe)
  const sortedLessons = currentModule.lessons || [];

  // Find the index of the last completed lesson in that module
  const lessonIndex = sortedLessons.findIndex((l) => l.id === lastLessonId);
  const lessonData = sortedLessons[lessonIndex] || null;

  // Try to get the next lesson in the current module
  if (lessonIndex !== -1 && lessonIndex + 1 < sortedLessons.length) {
    return sortedLessons[lessonIndex + 1];
  }

  // If there is no next lesson in current module, find the next module by position
  const sortedModules = course.modules;
  const moduleIndex = sortedModules.findIndex((m) => m.id === lastModuleId);

  if (moduleIndex !== -1 && moduleIndex + 1 < sortedModules.length) {
    const nextModule = sortedModules[moduleIndex + 1];
    const nextModuleLessons = nextModule.lessons || [];

    return nextModuleLessons.length > 0 ? nextModuleLessons[0] : lessonData;
  }
  // No next lesson available
  return lessonData;
}

export function findLessonById(course, lessonId) {
  if (!course || !lessonId) return;
  console.log(lessonId);
  for (const module of course.modules) {
    const lesson = module.lessons.find((lesson) => lesson.id === lessonId);
    if (lesson) {
      return lesson;
    }
  }
  return null; // Return null if lesson not found
}
