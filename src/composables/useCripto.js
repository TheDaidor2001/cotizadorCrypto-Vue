import { computed, onMounted, ref } from "vue";

export default function useCripto() {
  const cryptos = ref([]);
  const monedas = ref([
    { codigo: "USD", texto: "Dolar de Estados Unidos" },
    { codigo: "MXN", texto: "Peso Mexicano" },
    { codigo: "EUR", texto: "Euro" },
    { codigo: "GBP", texto: "Libra Esterlina" },
  ]);
  const cotizacion = ref({});
  const cargando = ref(false);

  onMounted(() => {
    fetch(
      "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD"
    )
      .then((res) => res.json())
      .then(({ Data }) => (cryptos.value = Data));
  });

  const obtenerCotizacion = async (cotizar) => {
    cargando.value = true
    cotizacion.value = {}
  
    try {
      const {moneda, criptomoneda} = cotizar
      const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`
  
      const res = await fetch(url)
      const data = await res.json()
      cotizacion.value = data.DISPLAY[criptomoneda][moneda]
  
    } catch (error) {
      console.log(error);
    }finally {
      cargando.value = false
    }
  }

  const mostrarResultado = computed(() => {
    return  Object.values(cotizacion.value).length
  })

  return {
    monedas,
    cryptos,
    cargando,
    cotizacion,
    obtenerCotizacion,
    mostrarResultado
  };
}
