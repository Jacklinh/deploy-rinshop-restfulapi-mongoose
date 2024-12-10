const result = await Promise.race([
    someSlowOperation(),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), 8000)
    )
  ]);