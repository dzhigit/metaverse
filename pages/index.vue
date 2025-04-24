<template>
  <div>
    <section class="content text-left">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <p v-if="error">{{ error }}</p>
            <div class="row">
              <div class="col-md-4">
                <ucp-component></ucp-component> <!-- Компонент с пользовательскими данными -->
              </div>
              <div class="col-md-8">
                <h4>Easy Ways To Make Money Quickly</h4>
                <p class="lead">Making money online has never been easier. You can make money up to $200/day just by sharing your link.</p>

                <h4>How It Works?</h4>
                <p class="lead">Simply copy your URL ID, invite others, and earn money for every visitor.</p>

                <h4>When will I get paid?</h4>
                <p class="lead">You can request payment when your balance reaches the minimum withdrawal threshold. Payment will be sent directly to your PayPal account.</p>
                <p class="text-right">
                  <NuxtLink to="/page/faq" class="btn btn-info btn-sm">Learn more &rarr;</NuxtLink>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Recent Payout Section -->
    <section class="content text-left">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <h3 class="text-center">Recent Payout</h3>
            <div v-if="payments.length">
              <table class="table table-bordered table-striped table-hover">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>URL ID</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="payment in payments" :key="payment.id">
                    <td>{{ payment.date }}</td>
                    <td>#{{ payment.reffId }}</td>
                    <td><i class="fab fa-paypal"></i> ${{ payment.amount }}</td>
                    <td><span :class="statusClass(payment.status)">{{ payment.statusText }}</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else>
              <div class="alert alert-danger text-center">There are currently no completed payments.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useFetch } from '#app'

const payments = ref([])
const error = ref('')

const statusClass = (status) => {
  if (status === 0) return 'badge-warning'
  if (status === 1) return 'badge-success'
  return ''
}

onMounted(async () => {
  try {
    const { data, error: fetchError } = await useFetch('/api/payments')
    if (fetchError.value) {
      error.value = fetchError.value.message
    } else {
      payments.value = data.value
    }
  } catch (err) {
    error.value = 'Failed to fetch payments data.'
  }
})
</script>
