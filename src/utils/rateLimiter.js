// Rate limiter for Airtable API requests
// Airtable limit: 5 requests per second per base

class RateLimiter {
  constructor(maxRequestsPerSecond = 5) {
    this.maxRequestsPerSecond = maxRequestsPerSecond;
    this.queue = [];
    this.processing = false;
    this.lastRequestTime = 0;
    this.minTimeBetweenRequests = 1000 / maxRequestsPerSecond; // 200ms for 5 req/sec
  }

  async throttle(fn) {
    return new Promise((resolve, reject) => {
      this.queue.push({ fn, resolve, reject });
      this.processQueue();
    });
  }

  async processQueue() {
    if (this.processing || this.queue.length === 0) {
      return;
    }

    this.processing = true;

    while (this.queue.length > 0) {
      const now = Date.now();
      const timeSinceLastRequest = now - this.lastRequestTime;
      
      if (timeSinceLastRequest < this.minTimeBetweenRequests) {
        // Wait before making the next request
        await new Promise(resolve => 
          setTimeout(resolve, this.minTimeBetweenRequests - timeSinceLastRequest)
        );
      }

      const { fn, resolve, reject } = this.queue.shift();
      this.lastRequestTime = Date.now();

      try {
        const result = await fn();
        resolve(result);
      } catch (error) {
        // If we get a rate limit error, add back to queue with delay
        if (error.message && error.message.includes('429')) {
          // Wait 1 second and retry
          await new Promise(resolve => setTimeout(resolve, 1000));
          this.queue.unshift({ fn, resolve, reject });
        } else {
          reject(error);
        }
      }
    }

    this.processing = false;
  }
}

// Create a singleton instance
export const rateLimiter = new RateLimiter(4); // Use 4 req/sec to be safe